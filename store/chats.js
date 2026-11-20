import ChatToast from '@/components/Chats/ChatToast';
import { playChatSound } from '@/utils/chatSound';
import { isWebPushSupported, registerServiceWorker, subscribeToPush, subscriptionPayload } from '@/utils/webPush';

const PAGE_LIMIT = 30;

const byId = (a, b) => Number(a.id) - Number(b.id);

// Socket bookkeeping lives outside of the state: it is not reactive data
let subscribedChannels = [];
let onConnected = null;
let onServiceWorkerMessage = null;

export const state = () => ({
  chats: [],
  chatsNextCursor: null,
  unread: { chats: 0, messages: 0 },
  activeChatId: null,
  messages: [],
  messagesNextCursor: null,
  clientLastReadMessageId: null,
  // Outgoing messages not yet confirmed by the server: { chat_id, client_message_id, text, failed }
  pending: [],
  // Web Push state in this browser: null (not checked yet), 'unsupported', 'denied', 'off', 'on'
  push: null,
});

export const getters = {
  activeChat: state => state.chats.find(chat => chat.id === state.activeChatId),
  activePending: state => state.pending.filter(item => item.chat_id === state.activeChatId),
};

export const mutations = {
  reset (state) {
    Object.assign(state, {
      chats: [],
      chatsNextCursor: null,
      unread: { chats: 0, messages: 0 },
      activeChatId: null,
      messages: [],
      messagesNextCursor: null,
      clientLastReadMessageId: null,
      pending: [],
      push: null,
    });
  },
  setChats (state, { items, next_cursor }) {
    state.chats = items;
    state.chatsNextCursor = next_cursor;
  },
  appendChats (state, { items, next_cursor }) {
    // A chat may already be here if a socket event lifted it to the top
    const known = new Set(state.chats.map(chat => chat.id));
    state.chats = state.chats.concat(items.filter(chat => !known.has(chat.id)));
    state.chatsNextCursor = next_cursor;
  },
  liftChat (state, chat) {
    state.chats = [chat, ...state.chats.filter(item => item.id !== chat.id)];
  },
  setChatUnread (state, { chatId, unreadCount }) {
    const chat = state.chats.find(item => item.id === chatId);
    if (chat) {
      chat.unread_count = unreadCount;
    }
  },
  setUnread (state, unread) {
    state.unread = unread;
  },
  setActiveChat (state, chatId) {
    state.activeChatId = chatId;
    state.messages = [];
    state.messagesNextCursor = null;
    state.clientLastReadMessageId = null;
  },
  setMessagesPage (state, { items, next_cursor, client_last_read_message_id }) {
    state.messages = items;
    state.messagesNextCursor = next_cursor;
    state.clientLastReadMessageId = client_last_read_message_id;
  },
  prependMessagesPage (state, { items, next_cursor }) {
    const known = new Set(state.messages.map(message => message.id));
    state.messages = items.filter(message => !known.has(message.id)).concat(state.messages);
    state.messagesNextCursor = next_cursor;
  },
  // Messages arrive both from HTTP responses and sockets: merge them by id
  upsertMessage (state, message) {
    const rest = state.messages.filter(item => item.id !== message.id);
    state.messages = [...rest, message].sort(byId);
  },
  setClientLastRead (state, messageId) {
    state.clientLastReadMessageId = messageId;
  },
  addPending (state, item) {
    state.pending.push(item);
  },
  setPendingFailed (state, { clientMessageId, failed }) {
    state.pending.find(item => item.client_message_id === clientMessageId).failed = failed;
  },
  removePending (state, clientMessageId) {
    state.pending = state.pending.filter(item => item.client_message_id !== clientMessageId);
  },
  setPush (state, push) {
    state.push = push;
  },
};

export const actions = {
  connect ({ dispatch }) {
    subscribedChannels = this.$auth.user.clubs.map(club => `chat.club.${club.id}`);
    subscribedChannels.forEach(name => {
      this.$echo.private(name)
        .listen('.chat.message', event => dispatch('onMessageEvent', event))
        .listen('.chat.read', event => dispatch('onReadEvent', event));
    });

    // Realtime does not replay missed events: reload everything after a reconnect
    const connection = this.$echo.connector.pusher.connection;
    let wasConnected = connection.state === 'connected';
    onConnected = () => {
      if (wasConnected) {
        dispatch('resync');
      }
      wasConnected = true;
    };
    connection.bind('connected', onConnected);

    dispatch('fetchUnread');
    dispatch('initPush');
  },
  disconnect ({ commit }) {
    subscribedChannels.forEach(name => this.$echo.leave(name));
    subscribedChannels = [];
    this.$echo.connector.pusher.connection.unbind('connected', onConnected);
    if (onServiceWorkerMessage) {
      navigator.serviceWorker.removeEventListener('message', onServiceWorkerMessage);
      onServiceWorkerMessage = null;
    }
    commit('reset');
  },
  async initPush ({ commit }) {
    if (!isWebPushSupported()) {
      commit('setPush', 'unsupported');
      return;
    }
    // Click on a system notification while an admin tab exists: sw.js asks that tab to route
    onServiceWorkerMessage = event => {
      if (event.data.type === 'chat.open') {
        this.$router.push(event.data.url);
      }
    };
    navigator.serviceWorker.addEventListener('message', onServiceWorkerMessage);

    const registration = await registerServiceWorker();
    const subscription = await registration.pushManager.getSubscription();
    if (Notification.permission === 'denied') {
      commit('setPush', 'denied');
    } else if (subscription && Notification.permission === 'granted') {
      // Re-send on every start: the backend drops subscriptions the push service has revoked
      await this.$axios.$post('v1/web-push/subscriptions', subscriptionPayload(subscription));
      commit('setPush', 'on');
    } else {
      commit('setPush', 'off');
    }
  },
  async enablePush ({ commit }) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      commit('setPush', permission === 'denied' ? 'denied' : 'off');
      return;
    }
    const { data } = await this.$axios.$get('v1/web-push/config');
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription()
      || await subscribeToPush(registration, data.public_key);
    await this.$axios.$post('v1/web-push/subscriptions', subscriptionPayload(subscription));
    commit('setPush', 'on');
  },
  // Also called before logout, so the next staff member on this browser has to opt in themselves
  async disablePush ({ commit }) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await this.$axios.$delete('v1/web-push/subscriptions', { data: { endpoint: subscription.endpoint } });
      await subscription.unsubscribe();
    }
    commit('setPush', 'off');
  },
  async resync ({ state, dispatch }) {
    await Promise.all([
      dispatch('fetchUnread'),
      dispatch('fetchChats'),
      state.activeChatId && dispatch('fetchMessages'),
    ]);
  },
  async fetchUnread ({ commit }) {
    const { data } = await this.$axios.$get('v1/chats/unread');
    commit('setUnread', data);
  },
  async fetchChats ({ commit }) {
    const { data } = await this.$axios.$get('v1/chats', { params: { limit: PAGE_LIMIT, cursor: 0 } });
    commit('setChats', data);
  },
  async fetchMoreChats ({ state, commit }) {
    const { data } = await this.$axios.$get('v1/chats', { params: { limit: PAGE_LIMIT, cursor: state.chatsNextCursor } });
    commit('appendChats', data);
  },
  async openChat ({ state, getters, commit, dispatch }, chatId) {
    commit('setActiveChat', chatId);
    await dispatch('fetchMessages');
    if (state.activeChatId === chatId && getters.activeChat && getters.activeChat.unread_count > 0) {
      await dispatch('markRead');
    }
  },
  closeChat ({ commit }) {
    commit('setActiveChat', null);
  },
  async fetchMessages ({ state, commit }) {
    const chatId = state.activeChatId;
    const { data } = await this.$axios.$get(`v1/chats/${chatId}/messages`, { params: { limit: PAGE_LIMIT, cursor: 0 } });
    // The user may have switched to another chat while the request was in flight
    if (state.activeChatId === chatId) {
      commit('setMessagesPage', data);
    }
  },
  async fetchOlderMessages ({ state, commit }) {
    const chatId = state.activeChatId;
    const { data } = await this.$axios.$get(`v1/chats/${chatId}/messages`, {
      params: { limit: PAGE_LIMIT, cursor: state.messagesNextCursor },
    });
    if (state.activeChatId === chatId) {
      commit('prependMessagesPage', data);
    }
  },
  // The menu badge is refreshed by the chat.read event the server sends back
  async markRead ({ state, commit }) {
    const chatId = state.activeChatId;
    const lastMessage = state.messages[state.messages.length - 1];
    await this.$axios.$post(`v1/chats/${chatId}/read`, { last_read_message_id: lastMessage.id });
    commit('setChatUnread', { chatId, unreadCount: 0 });
  },
  sendMessage ({ state, commit, dispatch }, text) {
    const item = { chat_id: state.activeChatId, client_message_id: crypto.randomUUID(), text, failed: false };
    commit('addPending', item);
    return dispatch('deliverMessage', item);
  },
  // Retries reuse the same client_message_id, so the server never stores a duplicate
  async deliverMessage ({ state, commit }, item) {
    commit('setPendingFailed', { clientMessageId: item.client_message_id, failed: false });
    try {
      const { data } = await this.$axios.$post(`v1/chats/${item.chat_id}/messages`, {
        text: item.text,
        client_message_id: item.client_message_id,
      });
      commit('removePending', item.client_message_id);
      if (state.activeChatId === item.chat_id) {
        commit('upsertMessage', data);
      }
    } catch (e) {
      // Network or validation failure: keep the message in the composer list with a retry button
      commit('setPendingFailed', { clientMessageId: item.client_message_id, failed: true });
    }
  },
  async onMessageEvent ({ state, commit, dispatch }, event) {
    commit('liftChat', {
      id: event.chat_id,
      client: event.client,
      last_message: event.message,
      unread_count: event.unread_count,
    });
    const isOpen = state.activeChatId === event.chat_id;
    if (isOpen) {
      commit('upsertMessage', event.message);
      commit('setClientLastRead', event.client_last_read_message_id);
    }
    if (event.message.author_type === 'client') {
      // A dialog counts as seen only when it is open in a visible tab;
      // otherwise ChatDialog marks it read once the tab becomes visible
      const isSeen = isOpen && document.visibilityState === 'visible';
      if (isSeen) {
        await dispatch('markRead');
      } else {
        dispatch('notify', event);
      }
    }
    await dispatch('fetchUnread');
  },
  notify ({ state }, { chat_id, client, message }) {
    playChatSound();
    // With Web Push on, a hidden tab leaves the alert to the system notification from sw.js
    if (document.visibilityState !== 'visible' && state.push === 'on') {
      return;
    }
    this.$toast({ component: ChatToast, props: { name: client.name, text: message.text } }, {
      toastClassName: 'chat-toast',
      icon: false,
      timeout: 10000,
      onClick: () => this.$router.push({ path: '/chats', query: { chat: chat_id } }),
    });
  },
  async onReadEvent ({ state, commit, dispatch }, event) {
    commit('setChatUnread', { chatId: event.chat_id, unreadCount: event.unread_count });
    if (state.activeChatId === event.chat_id) {
      commit('setClientLastRead', event.client_last_read_message_id);
    }
    await dispatch('fetchUnread');
  },
};

<template>
  <section class="chat-dialog">
    <header class="chat-dialog__header">
      <button type="button" class="chat-dialog__back" aria-label="К списку диалогов" @click="$emit('back')">
        <ArrowLeft :size="20" />
      </button>
      <div v-if="chat" class="chat-dialog__client">
        <span class="chat-dialog__name">{{ chat.client.name }}</span>
        <span class="chat-dialog__phone">{{ chat.client.phone }}</span>
      </div>
      <v-btn v-if="chat" :to="`/clients/${chat.client.id}`" icon target="_blank" title="Профиль клиента">
        <Eye :size="18" />
      </v-btn>
    </header>

    <div ref="scroll" class="chat-dialog__messages" @scroll="onScroll">
      <div v-if="loadingOlder" class="chat-dialog__hint">Загрузка…</div>
      <template v-for="(item, index) in items">
        <div v-if="showDayLabel(index)" :key="`day-${item.key}`" class="chat-dialog__day">
          {{ formatDayLabel(item.sent_at) }}
        </div>
        <div
          :key="item.key"
          class="chat-dialog__message"
          :class="item.author_type === 'staff' ? 'chat-dialog__message--staff' : 'chat-dialog__message--client'"
        >
          <div class="chat-dialog__bubble">
            <div v-if="item.author_type === 'staff'" class="chat-dialog__author">{{ item.author_name }}</div>
            <div class="chat-dialog__text">{{ item.text }}</div>
            <div class="chat-dialog__meta">
              <template v-if="item.pending">
                <button v-if="item.failed" type="button" class="chat-dialog__retry" @click="retry(item)">
                  <CircleAlert :size="14" /> Не отправлено. Повторить
                </button>
                <Clock v-else :size="14" />
              </template>
              <template v-else>
                <span>{{ formatMessageTime(item.sent_at) }}</span>
                <template v-if="item.author_type === 'staff'">
                  <CheckCheck v-if="isRead(item)" :size="16" class="chat-dialog__check--read" aria-label="Прочитано" />
                  <Check v-else :size="16" aria-label="Доставлено" />
                </template>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>

    <form class="chat-dialog__composer" @submit.prevent="send">
      <textarea
        ref="input"
        v-model="text"
        class="chat-dialog__input"
        rows="1"
        maxlength="2000"
        placeholder="Сообщение"
        @input="resizeInput"
        @keydown.enter.exact.prevent="send"
      />
      <button type="submit" class="chat-dialog__send" :disabled="!text.trim()" aria-label="Отправить">
        <SendHorizontal :size="20" />
      </button>
    </form>
  </section>
</template>

<script>
import { ArrowLeft, Check, CheckCheck, CircleAlert, Clock, Eye, SendHorizontal } from 'lucide-vue';
import { formatDayLabel, formatMessageTime, isReadByClient, isSameDayIso } from '@/utils/chats';

const NEAR_EDGE = 80;

export default {
  name: 'ChatDialog',
  components: { ArrowLeft, Check, CheckCheck, CircleAlert, Clock, Eye, SendHorizontal },
  data: () => ({
    text: '',
    loadingOlder: false,
  }),
  computed: {
    chat () {
      return this.$store.getters['chats/activeChat'];
    },
    items () {
      const messages = this.$store.state.chats.messages.map(message => ({ ...message, key: message.id }));
      const pending = this.$store.getters['chats/activePending'].map(item => ({
        ...item,
        key: item.client_message_id,
        author_type: 'staff',
        author_name: this.$auth.user.name,
        sent_at: new Date().toISOString(),
        pending: true,
      }));
      return messages.concat(pending);
    },
    lastItemKey () {
      return this.items.length ? this.items[this.items.length - 1].key : null;
    },
  },
  watch: {
    // Runs before the DOM update, so the scroll position still reflects the old content
    lastItemKey () {
      const el = this.$refs.scroll;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_EDGE;
      const own = this.items.length && this.items[this.items.length - 1].pending;
      if (nearBottom || own) {
        this.$nextTick(() => {
          el.scrollTop = el.scrollHeight;
        });
      }
    },
  },
  mounted () {
    this.$refs.input.focus();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  },
  beforeDestroy () {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  },
  methods: {
    // Messages that arrived while the tab was hidden are marked read when the user comes back
    onVisibilityChange () {
      if (document.visibilityState === 'visible' && this.chat && this.chat.unread_count > 0) {
        this.$store.dispatch('chats/markRead');
      }
    },
    formatDayLabel,
    formatMessageTime,
    isRead (message) {
      return isReadByClient(message, this.$store.state.chats.clientLastReadMessageId);
    },
    showDayLabel (index) {
      return index === 0 || !isSameDayIso(this.items[index - 1].sent_at, this.items[index].sent_at);
    },
    async onScroll () {
      const el = this.$refs.scroll;
      if (el.scrollTop > NEAR_EDGE || this.loadingOlder || !this.$store.state.chats.messagesNextCursor) {
        return;
      }
      this.loadingOlder = true;
      const previousHeight = el.scrollHeight;
      try {
        await this.$store.dispatch('chats/fetchOlderMessages');
        // Keep the visible messages in place after older ones are prepended
        await this.$nextTick();
        el.scrollTop += el.scrollHeight - previousHeight;
      } finally {
        this.loadingOlder = false;
      }
    },
    send () {
      const text = this.text.trim();
      if (!text) {
        return;
      }
      this.text = '';
      this.$nextTick(this.resizeInput);
      this.$store.dispatch('chats/sendMessage', text);
    },
    retry (item) {
      this.$store.dispatch('chats/deliverMessage', item);
    },
    resizeInput () {
      const input = this.$refs.input;
      input.style.height = 'auto';
      input.style.height = `${input.scrollHeight}px`;
    },
  },
};
</script>

<style scoped>
.chat-dialog {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.chat-dialog__header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 60px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--line);
}

.chat-dialog__back {
  display: flex;
  padding: 6px;
  border-radius: var(--radius-control);
  color: var(--text-muted);
}

.chat-dialog__back:hover {
  background: var(--surface-sunken);
}

@media (min-width: 768px) {
  .chat-dialog__back {
    display: none;
  }
}

.chat-dialog__client {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-dialog__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.chat-dialog__phone {
  font-size: 13px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.chat-dialog__messages {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
  background: var(--surface-page);
}

.chat-dialog__hint,
.chat-dialog__day {
  align-self: center;
  margin: 8px 0;
  font-size: 12px;
  color: var(--text-muted);
}

.chat-dialog__day {
  padding: 2px 10px;
  border-radius: 10px;
  background: var(--surface-selected);
}

.chat-dialog__message {
  display: flex;
}

.chat-dialog__message--staff {
  justify-content: flex-end;
}

.chat-dialog__bubble {
  max-width: min(75%, 560px);
  padding: 8px 12px 6px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--surface);
}

.chat-dialog__message--client .chat-dialog__bubble {
  border-bottom-left-radius: 4px;
}

.chat-dialog__message--staff .chat-dialog__bubble {
  border-color: color-mix(in oklab, var(--accent) 30%, var(--line));
  background: color-mix(in oklab, var(--accent) 10%, var(--surface));
  border-bottom-right-radius: 4px;
}

.chat-dialog__author {
  margin-bottom: 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-hover);
}

.chat-dialog__text {
  font-size: 14px;
  line-height: 1.45;
  color: var(--text);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.chat-dialog__meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 2px;
  font-size: 11px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.chat-dialog__check--read {
  color: var(--accent-hover);
}

.chat-dialog__retry {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--danger);
}

.chat-dialog__retry:hover {
  text-decoration: underline;
}

.chat-dialog__composer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--line);
}

.chat-dialog__input {
  flex: 1;
  max-height: 160px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  background: var(--surface);
  font-size: 14px;
  line-height: 1.45;
  color: var(--text);
  resize: none;
}

.chat-dialog__input:focus {
  outline: 2px solid var(--focus-ring);
  outline-offset: -1px;
  border-color: transparent;
  box-shadow: none;
}

.chat-dialog__send {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-control);
  background: var(--accent-hover);
  color: #fff;
}

.chat-dialog__send:disabled {
  background: var(--surface-selected);
  color: var(--text-faint);
}
</style>

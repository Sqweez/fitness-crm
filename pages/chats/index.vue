<template>
  <t-card-page title="Чаты">
    <div class="chats" :class="{ 'chats--dialog-open': activeChatId }">
      <chat-list class="chats__list" :active-chat-id="activeChatId" @select="selectChat" />
      <chat-dialog v-if="activeChatId" :key="activeChatId" class="chats__dialog" @back="selectChat(null)" />
      <div v-else class="chats__placeholder">Выберите диалог</div>
    </div>
  </t-card-page>
</template>

<script>
import manageChatsMiddleware from '@/middleware/manageChatsMiddleware';

export default {
  middleware: [manageChatsMiddleware],
  computed: {
    activeChatId () {
      return this.$route.query.chat || null;
    },
  },
  watch: {
    activeChatId: 'openActiveChat',
  },
  // The list goes first: opening a chat checks its unread_count to mark it read
  async created () {
    await this.$store.dispatch('chats/fetchChats');
    this.openActiveChat();
  },
  beforeDestroy () {
    this.$store.dispatch('chats/closeChat');
  },
  methods: {
    openActiveChat () {
      this.$store.dispatch(this.activeChatId ? 'chats/openChat' : 'chats/closeChat', this.activeChatId);
    },
    selectChat (chatId) {
      this.$router.push({ query: chatId ? { chat: chatId } : {} });
    },
  },
};
</script>

<style scoped>
.chats {
  display: grid;
  grid-template-columns: 1fr;
  height: calc(100vh - 220px);
  min-height: 480px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  overflow: hidden;
}

/* Mobile: list and dialog take turns */
.chats--dialog-open .chats__list,
.chats:not(.chats--dialog-open) .chats__placeholder {
  display: none;
}

.chats__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-muted);
  background: var(--surface-page);
}

@media (min-width: 768px) {
  .chats {
    grid-template-columns: 320px 1fr;
  }

  .chats--dialog-open .chats__list,
  .chats:not(.chats--dialog-open) .chats__placeholder {
    display: flex;
  }

  .chats__list {
    border-right: 1px solid var(--line);
  }
}
</style>

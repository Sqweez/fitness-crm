<template>
  <div class="chat-list">
    <div v-if="!chats.length" class="chat-list__empty">Диалогов пока нет</div>
    <button
      v-for="chat in chats"
      :key="chat.id"
      type="button"
      class="chat-list__item"
      :class="{ 'chat-list__item--active': chat.id === activeChatId }"
      @click="$emit('select', chat.id)"
    >
      <img v-if="chat.client.photo" :src="chat.client.photo" alt="" class="chat-list__avatar chat-list__avatar--photo">
      <span v-else class="chat-list__avatar">{{ initials(chat.client.name) }}</span>
      <span class="chat-list__body">
        <span class="chat-list__row">
          <span class="chat-list__name">{{ chat.client.name }}</span>
          <span class="chat-list__time">{{ formatListTime(chat.last_message.sent_at) }}</span>
        </span>
        <span class="chat-list__row">
          <span class="chat-list__preview">
            <template v-if="chat.last_message.author_type === 'staff'">{{ chat.last_message.author_name }}: </template>{{ chat.last_message.text }}
          </span>
          <span v-if="chat.unread_count" class="chat-list__badge">{{ chat.unread_count }}</span>
        </span>
      </span>
    </button>
    <button v-if="nextCursor" type="button" class="chat-list__more" :disabled="loadingMore" @click="loadMore">
      {{ loadingMore ? 'Загрузка…' : 'Показать ещё' }}
    </button>
  </div>
</template>

<script>
import { formatListTime } from '@/utils/chats';

export default {
  name: 'ChatList',
  props: {
    activeChatId: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    loadingMore: false,
  }),
  computed: {
    chats () {
      return this.$store.state.chats.chats;
    },
    nextCursor () {
      return this.$store.state.chats.chatsNextCursor;
    },
  },
  methods: {
    formatListTime,
    initials (name) {
      return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');
    },
    async loadMore () {
      this.loadingMore = true;
      try {
        await this.$store.dispatch('chats/fetchMoreChats');
      } finally {
        this.loadingMore = false;
      }
    },
  },
};
</script>

<style scoped>
.chat-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.chat-list__empty {
  padding: 24px 16px;
  font-size: 14px;
  color: var(--text-muted);
  text-align: center;
}

.chat-list__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--line-soft);
  transition: background 150ms ease;
}

.chat-list__item:hover {
  background: var(--surface-sunken);
}

.chat-list__item--active,
.chat-list__item--active:hover {
  background: var(--surface-selected);
}

.chat-list__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-selected);
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
}

.chat-list__avatar--photo {
  object-fit: cover;
}

.chat-list__item--active .chat-list__avatar {
  background: var(--surface);
}

.chat-list__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.chat-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.chat-list__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-list__time {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}

.chat-list__preview {
  font-size: 13px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-list__badge {
  flex-shrink: 0;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--accent-hover);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
}

.chat-list__more {
  margin: 12px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  font-size: 14px;
  color: var(--text);
}

.chat-list__more:hover:not(:disabled) {
  background: var(--surface-sunken);
}
</style>

<template>
  <div class="chat-toast-content">
    <span class="chat-toast-content__icon">
      <MessageCircle :size="18" />
    </span>
    <span class="chat-toast-content__body">
      <span class="chat-toast-content__name">{{ name }}</span>
      <span class="chat-toast-content__text">{{ text }}</span>
    </span>
  </div>
</template>

<script>
import { MessageCircle } from 'lucide-vue';

export default {
  name: 'ChatToast',
  components: { MessageCircle },
  props: {
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.chat-toast-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}

.chat-toast-content__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--accent) 14%, var(--surface));
  color: var(--accent-hover);
}

.chat-toast-content__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.chat-toast-content__name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Up to six lines: messages can be 2000 chars, the rest is one click away in the dialog */
.chat-toast-content__text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  white-space: pre-line;
  overflow-wrap: anywhere;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.4;
  color: var(--text-muted);
}
</style>

<template>
  <div v-if="push" class="chat-push" :class="`chat-push--${push}`">
    <component :is="icon" :size="18" class="chat-push__icon" />
    <span class="chat-push__text">{{ text }}</span>
    <button v-if="push === 'off'" type="button" class="chat-push__button chat-push__button--primary" :disabled="busy" @click="run('chats/enablePush')">
      Включить уведомления
    </button>
    <button v-else-if="push === 'on'" type="button" class="chat-push__button" :disabled="busy" @click="run('chats/disablePush')">
      Выключить
    </button>
  </div>
</template>

<script>
import { Bell, BellOff, BellRing } from 'lucide-vue';

const TEXTS = {
  off: 'Включите уведомления, чтобы видеть новые сообщения, даже когда админка закрыта.',
  on: 'Уведомления о новых сообщениях включены в этом браузере.',
  denied: 'Уведомления заблокированы. Разрешите их в настройках сайта: значок слева от адреса в браузере.',
  unsupported: 'Этот браузер не поддерживает уведомления или сайт открыт не по HTTPS.',
};

export default {
  name: 'ChatPushToggle',
  data: () => ({
    busy: false,
  }),
  computed: {
    push () {
      return this.$store.state.chats.push;
    },
    text () {
      return TEXTS[this.push];
    },
    icon () {
      return { on: BellRing, off: Bell }[this.push] || BellOff;
    },
  },
  methods: {
    async run (action) {
      this.busy = true;
      try {
        await this.$store.dispatch(action);
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>

<style scoped>
.chat-push {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--surface-sunken);
  font-size: 14px;
  color: var(--text-muted);
}

.chat-push--off {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--line));
  background: color-mix(in oklab, var(--accent) 8%, var(--surface));
  color: var(--text);
}

.chat-push--denied {
  border-color: color-mix(in oklab, var(--danger) 35%, var(--line));
  background: color-mix(in oklab, var(--danger) 6%, var(--surface));
  color: var(--text);
}

.chat-push__icon {
  flex-shrink: 0;
}

.chat-push--on .chat-push__icon,
.chat-push--off .chat-push__icon {
  color: var(--accent-hover);
}

.chat-push--denied .chat-push__icon {
  color: var(--danger);
}

.chat-push__text {
  flex: 1;
  min-width: 200px;
}

.chat-push__button {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-control);
  background: var(--surface);
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.chat-push__button:hover:not(:disabled) {
  background: var(--surface-sunken);
}

.chat-push__button--primary,
.chat-push__button--primary:hover:not(:disabled) {
  border-color: transparent;
  background: var(--accent-hover);
  color: #fff;
}

.chat-push__button:disabled {
  opacity: 0.6;
}
</style>

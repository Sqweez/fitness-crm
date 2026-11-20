<template>
  <div title="Чаты">
    <button
      aria-label="Чаты"
      @click="$router.push('/chats')"
      class="relative w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full"
    >
      <MessageCircle class="text-black" :size="20" />
      <span v-if="unread" class="chats-navbar-button__badge">{{ unread }}</span>
    </button>
  </div>
</template>

<script>
import { MessageCircle } from 'lucide-vue';

export default {
  components: { MessageCircle },
  computed: {
    unread () {
      return this.$store.state.chats.unread.chats;
    },
  },
};
</script>

<style scoped>
.chats-navbar-button__badge {
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: var(--danger);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
}
</style>

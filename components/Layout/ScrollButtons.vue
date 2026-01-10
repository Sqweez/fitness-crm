<template>
  <div class="fixed bottom-24 right-6 z-50 hidden md:flex flex-col gap-2">
    <v-btn
      v-show="showTop"
      fab
      small
      class="scroll-btn scroll-btn--up"
      @click="scrollToTop"
    >
      <ArrowUp :size="18" />
    </v-btn>
    <v-btn
      v-show="showBottom"
      fab
      small
      class="scroll-btn scroll-btn--down"
      @click="scrollToBottom"
    >
      <ArrowDown :size="18" />
    </v-btn>
  </div>
</template>

<script>
import { ArrowDown, ArrowUp } from 'lucide-vue';

export default {
  components: { ArrowDown, ArrowUp },
  data: () => ({
    showTop: false,
    showBottom: false,
    scrollContainer: null,
    onScroll: null,
    onResize: null,
    visibilityTimer: null,
  }),
  mounted() {
    this.scrollContainer = this.getScrollContainer();
    if (!this.scrollContainer) {
      return;
    }
    this.onScroll = () => this.scheduleVisibilityUpdate();
    this.onResize = () => this.scheduleVisibilityUpdate();
    this.scrollContainer.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    this.updateVisibility();
  },
  beforeDestroy() {
    if (this.scrollContainer && this.onScroll) {
      this.scrollContainer.removeEventListener('scroll', this.onScroll);
    }
    if (this.onResize) {
      window.removeEventListener('resize', this.onResize);
    }
    if (this.visibilityTimer) {
      clearTimeout(this.visibilityTimer);
      this.visibilityTimer = null;
    }
  },
  methods: {
    getScrollContainer() {
      return document.querySelector('#app-container');
    },
    scheduleVisibilityUpdate() {
      if (this.visibilityTimer) {
        clearTimeout(this.visibilityTimer);
      }
      this.visibilityTimer = setTimeout(() => {
        this.updateVisibility();
      }, 120);
    },
    updateVisibility() {
      if (!this.scrollContainer) {
        this.showTop = false;
        this.showBottom = false;
        return;
      }
      const threshold = 24;
      const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer;
      const maxScrollTop = Math.max(scrollHeight - clientHeight, 0);
      this.showTop = scrollTop > threshold;
      this.showBottom = scrollTop < maxScrollTop - threshold;
    },
    scrollToTop() {
      if (!this.scrollContainer) {
        return;
      }
      this.scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    scrollToBottom() {
      if (!this.scrollContainer) {
        return;
      }
      this.scrollContainer.scrollTo({
        top: this.scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
};
</script>

<style scoped lang="scss">
.scroll-btn {
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  color: #ffffff !important;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25) !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease !important;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }
}

.scroll-btn--up {
  background-color: #1d4ed8 !important;
}

.scroll-btn--down {
  background-color: #0ea5e9 !important;
}
</style>

<template>
  <article class="t-card-page" v-bind="$attrs">
    <header v-if="!noTitle && title" class="t-card-page__header">
      <h1 class="t-card-page__title">{{ title }}</h1>
    </header>
    <div class="t-card-page__body">
      <slot />
    </div>
  </article>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Страница'
    },
    noTitle: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({}),
  computed: {},
  methods: {}
}
</script>

<style scoped lang="scss">
.t-card-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-page);
}

.t-card-page__header {
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-soft);
}

.t-card-page__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text);
}

.t-card-page__body {
  color: var(--text);
}

@media (min-width: 640px) {
  .t-card-page {
    padding: 24px;
  }

  .t-card-page__title {
    font-size: 22px;
  }
}
</style>

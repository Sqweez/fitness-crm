<template>
  <article class="t-card-page" v-bind="$attrs">
    <header v-if="!noTitle" class="t-card-page__header">
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
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.t-card-page__header {
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.t-card-page__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  color: #0f172a;
}

.t-card-page__body {
  color: #0f172a;
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

<template>
  <div class="welcome-banner p-4 sm:p-6 mb-8">
    <h1 class="text-xl md:text-2xl font-semibold mb-1 welcome-banner__title">Приветствуем Вас в Fitness CRM</h1>
    <p class="text-sm md:text-base welcome-banner__text">Удачной работы и хорошего дня!</p>

  </div>
</template>

<script>
export default {
  name: 'WelcomeBanner',
}
</script>

<style scoped>
.welcome-banner {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-page);
}

.welcome-banner__title {
  color: var(--text);
}

.welcome-banner__text {
  color: var(--text-muted);
}
</style>

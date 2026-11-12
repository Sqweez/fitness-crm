<template>
  <t-card-page title="Добавление тренера">
    <trainer-form @saved="$router.push('/mobile/trainers')" />
  </t-card-page>
</template>

<script>
import manageTrainersMiddleware from '@/middleware/manageTrainersMiddleware';

export default {
  middleware: [manageTrainersMiddleware],
};
</script>

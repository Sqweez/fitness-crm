<template>
  <div>
    <base-modal
      :state="state"
      :title="title"
      @close="_reject"
    >
      <template #default>
        <p class="font-medium text-base">
          {{ text }}
        </p>
      </template>
      <template #actions>
        <v-btn text @click="_reject">
          Закрыть
        </v-btn>
        <v-spacer />
        <v-btn text color="success" @click="_confirm">
          Подтвердить <Check :size="18" class="ml-1" />
        </v-btn>
      </template>
    </base-modal>
  </div>
</template>

<script>
import { Check } from 'lucide-vue';

export default {
  components: { Check },
  data: () => ({
    resolvePromise: undefined,
    rejectPromise: undefined,
  }),
  computed: {},
  props: {
    title: {
      type: String,
      default: 'Подтвердите действие',
    },
    state: {
      type: Boolean
    },
    text: {
      type: String,
      default: 'Подтвердите выбранное действие'
    }
  },
  watch: {
    state (val) {
      this.show();
    }
  },
  methods: {
    show () {
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve
        this.rejectPromise = reject
      })
    },
    _confirm () {
      this.$emit('confirmed', true);
      //this.resolvePromise(true);
    },
    _reject () {
      this.$emit('confirmed', false);
    }
  },
}
</script>

<style scoped lang="scss">

</style>

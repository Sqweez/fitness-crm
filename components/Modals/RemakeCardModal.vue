<template>
  <div>
    <base-modal
      title="Переоформление карты"
      @close="$emit('close')"
      :state="state"
      :max-width="1000"
    >
      <template #default>
        <div class="p-4">
          <form @submit.prevent="doLoginViaCode" class="h-0 w-0 opacity-0">
            <input type="password" v-model="code"  ref="passInputRef" >
          </form>
          <h4 class="text-center font-medium" @click="doLoginViaCode">
            Приложите новую карту
          </h4>
        </div>
      </template>
    </base-modal>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  data: () => ({
    code: '',
    interval: null
  }),
  computed: {},
  methods: {
    ...mapActions({
      $remakePass: 'clients/remakePass',
    }),
    async doLoginViaCode () {
      try {
        this.$loader.enable();
        const code = this.code;
        this.code = '';
        await this.$remakePass(code);
        this.$emit('close');
      } catch (e) {
        console.log();
      } finally {
        this.$loader.disable();
      }
    },
  },
  props: {
    state: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    state (val) {
      if (val) {
        this.interval = setInterval(() => {
          const input = this.$refs.passInputRef;
          if (input) {
            input.focus();
          }
        }, 300)
      } else {
        if (this.interval) {
          clearInterval(this.interval);
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>

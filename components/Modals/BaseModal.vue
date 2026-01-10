<template>
  <div>
    <v-dialog
      v-model="state"
      :max-width="maxWidth"
      :persistent="persistent"
      @click:outside="onClickOutside"
      @keydown.esc="onClickOutside"
    >
      <v-card>
        <v-card-title v-if="!isLoading">
          <div class="flex items-center justify-between">
            {{ title }}
          </div>
          <v-btn icon text @click="$emit('close')" v-show="!persistent" outlined>
            <X :size="20" />
          </v-btn>
        </v-card-title>
        <v-card-text>
          <slot v-if="!isLoading"/>
          <div class="flex justify-center items-center w-full h-32" v-if="isLoading">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-card-text>
        <v-card-actions v-if="!isLoading">
          <slot name="actions"></slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import { X } from 'lucide-vue';

export default {
  components: { X },
  data: () => ({}),
  computed: {
    ...mapGetters({
      isLoading: 'utils/IS_LOADING'
    })
  },
  methods: {
    onClickOutside(e) {
      if (!this.persistent) {
        return this.$emit('close');
      }
    }
  },
  emits: ['close'],
  props: {
    state: {
      type: Boolean,
      required: true
    },
    maxWidth: {
      type: Number,
      default: 500
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Модальное окно'
    }
  }
}
</script>

<style scoped lang="scss">

</style>

<template>
  <base-modal :state="state" :max-width="600" @close="$emit('close')">
    <template #default>
      <v-text-field
        label="Название категории"
        v-model="name"
      />
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn color="success" text @click="onSubmit">
        Сохранить <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions} from 'vuex';
import { Check } from 'lucide-vue';

export default {
  components: { Check },
  props: {
    state: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    name: '',
  }),
  watch: {
    state () {
      this.name = '';
    }
  },
  computed: {},
  methods: {
    ...mapActions({
      create: 'products/createCategory',
    }),
    async onSubmit () {
      try {
        this.$loader.enable();
        const category = await this.create({name: this.name});
        this.$emit('created', category);
        this.$emit('close');
      } catch (e) {
        console.log(e);
      } finally {
        this.$loader.disable();
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>

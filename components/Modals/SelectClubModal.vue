<template>
  <base-modal
    :state="state"
    :max-width="700"
    :persistent="!isClubWasPreviouslyChosen"
    title="Выбор клуба"
    @close="$emit('close')"
  >
    <template #default>
      <h2 class="text-xl text-center">
        Выберите клуб, в котором вы сегодня работаете:
      </h2>
      <v-select
        placeholder="Выберите клуб"
        label="Клуб"
        title="Клуб"
        :items="$user.clubs"
        item-text="name"
        item-value="id"
        v-model="club_id"
      />
    </template>
    <template #actions>
      <v-spacer />
      <v-btn text color="success" :disabled="!club_id" @click.prevent="onSubmit">
        Подтвердить <v-icon>mdi-check</v-icon>
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import userMixin from '@/mixins/userMixin';
import {mapActions} from 'vuex';

export default {
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  mixins: [userMixin],
  data: () => ({
    club_id: undefined,
  }),
  computed: {
    isClubWasPreviouslyChosen () {
      return this.$user.club.id !== null;
    }
  },
  methods: {
    ...mapActions({
      $chooseClub: 'user/chooseClub',
    }),
    async onSubmit () {
      try {
        this.$loader.enable();
        await this.$chooseClub(this.club_id);
        window.location.reload();
      } catch (e) {

      } finally {
        this.$loader.disable();
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>

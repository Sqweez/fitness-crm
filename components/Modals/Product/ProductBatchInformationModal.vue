<template>
  <div>
    <base-modal
      title="История пополнений"
      :state="state"
      :max-width="1000"
      @close="$emit('close')"
    >
      <template #default>
        <v-select
          label="Клуб"
          :items="clubs"
          item-text="name"
          item-value="id"
          v-model="clubId"
          :disabled="!IS_BOSS"
        />
        <v-data-table
          :items-per-page="-1"
          :items="batches"
          :headers="headers"
        ></v-data-table>
      </template>
    </base-modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import userMixin from '@/mixins/userMixin';

export default {
  mixins: [userMixin],
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    information: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    clubId: -1,
    headers: [
      {
        text: 'Клуб',
        value: 'club.name'
      },
      {
        text: 'Пользователь',
        value: 'user.name'
      },
      {
        text: 'Количество',
        value: 'quantity'
      },
      {
        text: 'Дата',
        value: 'date'
      }
    ],
  }),
  mounted() {
    if (!this.IS_BOSS) {
      this.clubId = this.$currentClub;
    }
  },
  computed: {
    ...mapGetters({
      clubs: 'common/CLUBS_FILTERS'
    }),
    batches () {
      return this.information.filter(i => {
        return this.clubId === -1  ? true : i.club.id === this.clubId;
      })
    }
  },
}
</script>

<style scoped lang="scss">

</style>

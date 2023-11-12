<template>
  <base-modal
    v-bind="$attrs"
    :state="state"
    @close="$emit('close')"
    :max-width="1000"
  >
    <template #default>
      <div v-if="state">
        <p>Программа: <b>{{ service.name }}</b></p>
        <p>Дата покупки: <b>{{ report.purchase_date }}</b></p>
        <p>Кто продал: <b>{{ report.user.name }}</b></p>
        <p>Стоимость: <b>{{ report.price | priceFilters }}</b></p>
        <p>Дата активации: <b>{{ report.activated_at }}</b></p>
        <p>Последний тренер: <b>{{ service.last_trainer.name }}</b></p>
        <p>Сделано посещений: <b>{{ service.visits_count }}</b></p>
      </div>
      <div v-if="report" class="my-2">
        <v-tabs v-model="tab" color="blue darken-2">
          <v-tab
            v-for="item in tabs"
            :key="item.title"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item in tabs"
            :key="item.title"
          >
            <div v-if="tab === 0">
              <v-data-table
                :items-per-page="-1"
                :items="report.visits"
                :headers="visitHeaders"
                no-data-text="Нет посещений"
              >
                <template v-slot:item.additional="{ item }">
                  <v-list>
                    <t-list-item v-if="item.is_penalty" title="Штрафное">
                      <v-icon color="success">mdi-check</v-icon>
                    </t-list-item>
                    <t-list-item v-if="item.trainer.id" title="Тренер">
                      {{ item.trainer.name }}
                    </t-list-item>
                    <t-list-item v-if="item.description" title="Комментарий">
                      {{ item.description }}
                    </t-list-item>
                  </v-list>
                </template>
              </v-data-table>
            </div>
            <div v-if="tab === 1">
              <v-data-table
                :items-per-page="-1"
                :items="report.restores"
                :headers="restoreHeaders"
                no-data-text="Нет пролонгаций"
              >
                <template v-slot:item.additional="{ item }">
                  <v-list>
                    <t-list-item title="Восстановлено до">
                      {{ item.restore_until }}
                    </t-list-item>
                    <t-list-item  title="Стоимость">
                      {{ item.restore_price | priceFilters }}
                    </t-list-item>
                  </v-list>
                </template>
              </v-data-table>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    service: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    restoreHeaders: [
      {
        value: 'name',
        text: 'Услуга'
      },
      {
        value: 'date',
        text: 'Дата'
      },
      {
        value: 'user.name',
        text: 'Сотрудник'
      },
      {
        value: 'additional',
        text: 'Дополнительно'
      }
    ],
    visitHeaders: [
      {
        value: 'name',
        text: 'Услуга'
      },
      {
        value: 'date',
        text: 'Дата'
      },
      {
        value: 'club.name',
        text: 'Клуб'
      },
      {
        value: 'user',
        text: 'Сотрудник'
      },
      {
        value: 'additional',
        text: 'Дополнительно'
      }
    ],
    report: null,
    tab: 0,
    tabs: [
      {
        title: 'Посещения',
        value: 0
      },
      {
        title: 'Пролонгация',
        value: 1
      }
    ],
  }),
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT'
    })
  },
  methods: {
    ...mapActions({
      $getInformation: 'clients/getPurchasedServiceInformation',
    }),
    async _getPurchaseServiceInformation () {
      try {
        this.$loader.enable();
        const { data: { report } } = await this.$getInformation({serviceId: this.service.id, clientId: this.client.id});
        this.report = report[0];
      } catch (e) {
        console.log(e);
      } finally {
        this.$loader.disable();
      }
    },
  },
  watch: {
    async state (value) {
      if (value) {
        await this._getPurchaseServiceInformation();
      } else {
        this.report = null;
        this.tab = 0;
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>

<template>
  <v-sheet class="client-session-v2" elevation="2" rounded="lg">
    <trinket-modal :state="showTrinketModal" @close="showTrinketModal = false" />
    <div class="session-top">
      <div class="title-block">
        <div class="eyebrow">Сегодня</div>
        <h3 class="mb-1">Сессия клиента</h3>
        <div class="name">{{ client.name }}</div>
      </div>
      <div class="session-meta">
        <div class="meta-label">Шкафчик</div>
        <div class="meta-value">
          {{ client.trinket ? client.cabinet_number : '—' }}
        </div>
        <div v-if="!client.trinket" class="meta-sub">Не назначен</div>
      </div>
    </div>

    <div class="session-actions">
      <div class="action-row" v-if="client.trinket_can_given">
        <div class="action-copy">
          <div class="action-title">Выдать ключ</div>
          <div class="action-sub">Подготовьте шкафчик перед визитом</div>
        </div>
        <v-btn color="primary" @click="showTrinketModal = true">
          Выдать <Key :size="18" class="ml-1" />
        </v-btn>
      </div>

      <div class="action-row" v-if="client.session_can_be_finished || client.trinket_can_given">
        <div class="action-copy">
          <div class="action-title">Завершить посещение</div>
          <div class="action-sub">Закрыть активную сессию клиента</div>
        </div>
        <v-btn dark color="red lighten-1" @click="_onFinishVisitClick">
          Завершить <XCircle :size="18" class="ml-1" />
        </v-btn>
      </div>

      <div
        v-if="!client.trinket_can_given && !client.session_can_be_finished"
        class="empty-state"
      >
        Нет доступных действий для этой сессии
      </div>
    </div>
  </v-sheet>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Key, XCircle } from 'lucide-vue'

export default {
  components: { Key, XCircle },
  data: () => ({
    showTrinketModal: false
  }),
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT'
    })
  },
  methods: {
    ...mapActions({
      $finishVisit: 'clients/finishVisit'
    }),
    _onFinishVisitClick () {
      this.$confirm(`Вы действительно хотите завершить сеанс клиента ${this.client.name}?`)
        .then(async _ => {
          try {
            this.$loader.enable()
            await this.$finishVisit()
          } catch (e) {
            //
          } finally {
            this.$loader.disable()
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.client-session-v2 {
  background: #fefce8;
  border: 1px solid #fcd34d;
  padding: 20px;
}

.session-top {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 18px;
}

.eyebrow {
  color: #a16207;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.name {
  color: #92400e;
  font-size: 14px;
}

.session-meta {
  background: #fef3c7;
  border-radius: 12px;
  min-width: 160px;
  padding: 12px 14px;
  text-align: right;
}

.meta-label {
  color: #92400e;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.meta-value {
  color: #78350f;
  font-size: 24px;
  font-weight: 700;
  margin-top: 6px;
}

.meta-sub {
  color: #b45309;
  font-size: 12px;
}

.session-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-row {
  align-items: center;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  padding: 14px 16px;
}

.action-title {
  color: #78350f;
  font-size: 15px;
  font-weight: 600;
}

.action-sub {
  color: #b45309;
  font-size: 12px;
}

.empty-state {
  border: 1px dashed #f59e0b;
  border-radius: 12px;
  color: #b45309;
  font-size: 13px;
  padding: 14px;
}
</style>

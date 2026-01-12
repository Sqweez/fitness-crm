<template>
  <v-card class="client-session-v1" outlined>
    <trinket-modal :state="showTrinketModal" @close="showTrinketModal = false" />
    <div class="px-5 py-4">
      <div class="session-header">
        <div>
          <div class="overline text-uppercase">Сессия</div>
          <h3 class="mb-1">Текущая сессия</h3>
        </div>
        <v-chip small color="green darken-2" text-color="white" class="font-weight-medium">
          Активна
        </v-chip>
      </div>

      <div class="session-grid">
        <div class="info-block">
          <div class="label">Шкафчик</div>
          <div v-if="client.trinket" class="cabinet-number">
            {{ client.cabinet_number }}
          </div>
          <div v-else class="muted">Не назначен</div>
        </div>

        <div class="actions-block">
          <div class="label">Действия</div>
          <div class="actions">
            <v-btn
              color="primary"
              class="action-btn"
              @click="showTrinketModal = true"
              v-if="client.trinket_can_given"
            >
              Выдать ключ <Key :size="18" class="ml-1" />
            </v-btn>
            <v-btn
              dark
              color="red lighten-1"
              class="action-btn"
              @click="_onFinishVisitClick"
              v-if="client.session_can_be_finished || client.trinket_can_given"
            >
              Завершить посещение <XCircle :size="18" class="ml-1" />
            </v-btn>
          </div>
          <div
            v-if="!client.trinket_can_given && !client.session_can_be_finished"
            class="muted"
          >
            Доступных действий нет
          </div>
        </div>
      </div>
    </div>
  </v-card>
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
.client-session-v1 {
  border-radius: 16px;
  overflow: hidden;
}

.session-header {
  align-items: center;
  background: linear-gradient(120deg, #1f2937 0%, #334155 100%);
  border-radius: 12px;
  color: #f8fafc;
  display: flex;
  justify-content: space-between;
  margin: -4px -4px 20px;
  padding: 16px 18px;
}

.session-subtitle {
  color: #cbd5f5;
  font-size: 13px;
}

.session-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;
}

.info-block,
.actions-block {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.label {
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cabinet-number {
  color: #0f172a;
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0 2px;
}

.hint {
  color: #94a3b8;
  font-size: 12px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.action-btn {
  justify-content: space-between;
}

.muted {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 8px;
}

@media (min-width: 960px) {
  .session-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

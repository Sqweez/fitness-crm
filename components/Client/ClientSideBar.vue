<template>
  <div>
    <div class="client-sidebar">
      <div class="client-sidebar__card">
      <div class="client-sidebar__profile">
        <div class="client-sidebar__avatar">
          <img :src="client.photo ? client.photo : avatar" :alt="client.name" class="client-sidebar__avatar-image">
        </div>
        <div class="client-sidebar__identity">
          <p class="client-sidebar__name">{{ client.name }}</p>
        </div>
      </div>

      <div class="client-sidebar__section">
        <dl class="client-sidebar__list">
          <div class="client-sidebar__row client-sidebar__row--balance" :class="{ 'client-sidebar__row--negative': client.balance < 0 }">
            <dt>Баланс</dt>
            <dd>{{ client.balance | priceFilters }}</dd>
          </div>
          <div class="client-sidebar__row">
            <dt>Кто зарегистрировал</dt>
            <dd>{{ client.registrar }}</dd>
          </div>
          <div class="client-sidebar__row">
            <dt>Возраст</dt>
            <dd>{{ client.age_type }} ({{ client.age }})</dd>
          </div>
          <div class="client-sidebar__row">
            <dt>Телефон</dt>
            <dd>{{ client.unmasked_phone }}</dd>
          </div>
        </dl>
      </div>

      <div class="client-sidebar__section client-sidebar__note">
        <label class="client-sidebar__label" for="client-note">Заметка о клиенте</label>
        <v-textarea
          id="client-note"
          rows="6"
          v-model="client.description"
          class="client-sidebar__textarea"
          @blur="_onNoteBlur"
          @keydown.ctrl.enter="_updateDescription"
          @keydown.meta.enter="_updateDescription"
        ></v-textarea>
      </div>

      <details v-show="!IS_BARTENDER" class="client-sidebar__details">
        <summary class="client-sidebar__summary">Дополнительно</summary>
        <dl class="client-sidebar__details-body">
          <div class="client-sidebar__row">
            <dt>Пол</dt>
            <dd>{{ client.gender_display }}</dd>
          </div>
          <div class="client-sidebar__row">
            <dt>Телефон</dt>
            <dd>{{ client.phone }}</dd>
          </div>
          <div class="client-sidebar__row">
            <dt>Дата рождения</dt>
            <dd>{{ client.birth_date_formatted }}</dd>
          </div>
          <div v-if="client.birth_date" class="client-sidebar__row">
            <dt>Возраст</dt>
            <dd>{{ client.age }}</dd>
          </div>
          <div class="client-sidebar__row">
            <dt>Сейчас в клубе</dt>
            <dd><status-icons :state="client.is_in_club" /></dd>
          </div>
          <div v-if="client.cabinet_number" class="client-sidebar__row">
            <dt>Номер шкафчика</dt>
            <dd>{{ client.cabinet_number }}</dd>
          </div>
          <div class="client-sidebar__row">
            <dt>Пароль для приложения</dt>
            <dd>{{ client.mobile_password }}</dd>
          </div>
        </dl>
      </details>
      </div>

      <div class="client-sidebar__actions">
        <v-btn v-if="!client.in_bookmark" block class="action-btn action-btn--secondary" @click="addToBookmark">
          В закладку гостей
        </v-btn>
        <v-btn v-if="client.in_bookmark" block class="action-btn action-btn--secondary" @click="removeFromBookmark">
          Удалить из закладки гостей
        </v-btn>
        <div class="client-sidebar__actions-group" v-if="!IS_BARTENDER">
          <v-btn block class="action-btn action-btn--outline" @click="openWhatsapp">
            Сообщение клиенту <MessageCircle :size="18" class="ml-1" />
          </v-btn>
          <v-btn block class="action-btn action-btn--primary" @click="$router.push(`/clients/edit/${client.id}`)">
            Редактор профиля
          </v-btn>
          <v-btn block class="action-btn action-btn--secondary" @click="onRemakeCardClick">
            Переоформить карту
          </v-btn>
          <div v-if="IS_BOSS" class="client-sidebar__danger">
            <v-btn block class="action-btn action-btn--destructive" @click="_onClientDelete">
              Удалить клиента
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <lazy-remake-card-modal
      :state="showCardModal"
      @close="showCardModal = false"
    />
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {__hardcoded, deepClone, openInNewTab} from "@/utils/helpers";
import UserAvatar from "assets/images/logo.jpg";
import userMixin from '@/mixins/userMixin';
import {openInWhatsapp} from '@/utils/clients/clientsFunctions';
import { MessageCircle } from 'lucide-vue';

export default {
  components: { MessageCircle },
  data: () => ({
    avatar: UserAvatar,
    showCardModal: false,
  }),
  mixins: [
    userMixin
  ],
  computed: {
    ...mapGetters({
      '_client': 'clients/CLIENT',
    }),
    client () {
      return deepClone(this._client);
    }
  },
  methods: {
    ...mapActions({
      $updateClient: 'clients/updateClient',
      $removeClient: 'clients/removeClient',
      $removeBookmark: 'bookmark/removeFromBookmark',
      $createBookmark: 'bookmark/createBookmark',
    }),
    openWhatsapp () {
      return openInWhatsapp(this._client.unmasked_phone);
    /*  const phone = this._client.unmasked_phone.substring(1);
      const link = `https://api.WhatsApp.com/send?phone=${phone}`
      openInNewTab(link);*/
    },
    async _onClientDelete () {
      this.$confirm('Вы действительно хотите удалить выбранного клиента?')
        .then(async () => {
          this.$loader.enable();
          await this.$removeClient();
          await this.$router.push('/');
          this.$loader.disable();
        })
    },
    onRemakeCardClick () {
      const remakeCardPrice = __hardcoded(1000);
      if (this.client.balance < remakeCardPrice) {
        return this.$toast.error('Недостаточно средств!');
      }
      this.showCardModal = true;
    },
    async addToBookmark () {
      this.$loader.enable();
      await this.$createBookmark({
        client_id: this.client.id
      });
      this.$store.commit('clients/setClient', {
        ...this.client,
        in_bookmark: true,
      })
      this.$loader.disable();
    },
    async removeFromBookmark () {
      this.$loader.enable();
      await this.$removeBookmark(this.client.id)
      this.$store.commit('clients/setClient', {
        ...this.client,
        in_bookmark: false,
      })
      this.$loader.disable();
    },
    _onNoteBlur () {
      if (this.client.description !== this._client.description) {
        this._updateDescription();
      }
    },
    async _updateDescription () {
      this.$loader.enable('Идет обновление...');
      const payload = {
        id: this.client.id,
        name: this.client.name,
        //pass: this.client?.pass?.code,
        description: this.client.description,
        club_id: this.client.club.id,
        phone: this.client.phone,
      };

      if (!payload.pass) {
        delete payload.pass;
      }

      await this.$updateClient(payload);
      this.$loader.disable();
    },
  }
}
</script>

<style scoped lang="scss">
.client-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
}

// One card for profile, facts, note and details; sections split by hairlines
.client-sidebar__card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-page);
  overflow: hidden;

  > * + * {
    border-top: 1px solid var(--line-soft);
  }
}

.client-sidebar__profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 16px;
}

.client-sidebar__avatar {
  width: 168px;
  height: 168px;
  border-radius: var(--radius-panel);
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--surface-sunken);
}

.client-sidebar__avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.client-sidebar__identity {
  text-align: center;
}

.client-sidebar__name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.35;
  word-break: break-word;
}

.client-sidebar__phone {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.4;
  word-break: break-word;
}

.client-sidebar__section {
  padding: 14px 16px;
}

.client-sidebar__list,
.client-sidebar__details-body {
  display: grid;
  gap: 10px;
  margin: 0;
}

.client-sidebar__row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  color: var(--text);

  dt {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.4;
  }

  dd {
    font-weight: 500;
    color: var(--text);
    margin: 0;
    line-height: 1.4;
    word-break: break-word;
  }
}

// Balance is the figure the front desk acts on: sell, top up, check debt
.client-sidebar__row--balance {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line-soft);

  dd {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
  }
}

.client-sidebar__row--negative dd {
  color: var(--danger);
}

.client-sidebar__note {
  background: #f8fafc;
}

.client-sidebar__label {
  display: block;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
}

.client-sidebar__textarea {
  width: 100%;
}

.client-sidebar__details {
  summary {
    list-style: none;
    cursor: pointer;
    padding: 12px 16px;
    font-weight: 600;
    font-size: 14px;
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      background: var(--surface-sunken);
    }
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: '▾';
    font-size: 12px;
    color: var(--text-faint);
    transition: transform 0.2s ease;
  }

  &[open] summary::after {
    transform: rotate(180deg);
  }
}

.client-sidebar__details-body {
  padding: 4px 16px 14px;
}

.client-sidebar__actions {
  display: grid;
  gap: 8px;
}

.client-sidebar__actions-group {
  display: grid;
  gap: 8px;
}

// Irreversible action kept apart from everyday ones
.client-sidebar__danger {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.action-btn {
  border: 1px solid #e2e8f0 !important;
  background: #ffffff !important;
  color: #0f172a !important;
  box-shadow: none !important;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
}

.action-btn--primary {
  background: #0f172a !important;
  border-color: #0f172a !important;
  color: #ffffff !important;

  &:hover {
    background: #1e293b !important;
    border-color: #1e293b !important;
  }
}

.action-btn--secondary {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
  color: #0f172a !important;

  &:hover {
    background: #f1f5f9 !important;
  }
}

.action-btn--outline {
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
  color: #0f172a !important;

  &:hover {
    background: #f8fafc !important;
  }
}

.action-btn--destructive {
  background: #dc2626 !important;
  border-color: #dc2626 !important;
  color: #ffffff !important;

  &:hover {
    background: #b91c1c !important;
    border-color: #b91c1c !important;
  }
}

:deep(.client-sidebar__note .v-input__slot) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 10px !important;
  background: #ffffff !important;
  box-shadow: none !important;
  padding: 6px 8px !important;
}

:deep(.client-sidebar__note textarea) {
  font-size: 14px !important;
  line-height: 20px !important;
  color: #0f172a !important;
}

:deep(.client-sidebar__note .v-label) {
  display: none !important;
}

:deep(.client-sidebar__note .v-input__control) {
  min-height: 0 !important;
}

:deep(.client-sidebar__note .v-messages) {
  display: none !important;
}
</style>

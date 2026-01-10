<template>
  <base-modal
    :state="state"
    :max-width="800"
    title="Списание услуги"
    @close="$emit('close')"
  >
    <template #default v-if="state">
      <v-alert type="warning" v-if="service.already_written_off">
        Внимание! Данная услуга уже была списана в рамках данного посещения.
      </v-alert>
      <v-alert type="warning" v-if="penalty">
        Вы списываете услугу в режиме "штрафа". Посещение клиента не будет открыто.
      </v-alert>
      <p class="font-medium text-base">
        Вы действительно хотите <span v-if="!service.is_activated">активировать и </span>списать услугу {{ service.name }}?
      </p>
      <v-checkbox
        label="Без тренера"
        v-model="withoutTrainer"
      />
      <v-autocomplete
        v-if="!withoutTrainer"
        label="Тренер"
        :items="trainers"
        item-text="name"
        item-value="id"
        v-model="trainerId"
      />
      <v-row justify="start" v-if="penalty" class="mb-2">
        <v-date-picker v-model="penaltyDate"></v-date-picker>
      </v-row>
<!--      <v-text-field
        v-if="penalty"
        label="Дата списания"
        required
        type="date"
        v-model="penaltyDate"
      />-->
      <v-textarea
        v-if="penalty"
        label="Причина списания"
        v-model="description"
      />
    </template>
    <template #actions>
      <v-btn text @click="$emit('close')">
        Отмена
      </v-btn>
      <v-spacer />
      <v-btn text @click="_onSubmit" color="success">
        Списать <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import userMixin from '@/mixins/userMixin';
import {__hardcoded} from '@/utils/helpers';
import { Check } from 'lucide-vue';

export default {
  components: { Check },
  mixins: [userMixin],
  data: () => ({
    trainerId: null,
    withoutTrainer: false,
    description: '',
    penaltyDate: null,
  }),
  props: {
    state: {
      type: Boolean,
      required: true
    },
    service: {
      type: Object,
      required: true,
    },
    penalty: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    ...mapGetters({
      client: 'clients/CLIENT',
      isLoading: 'utils/IS_LOADING'
    }),
    trainers () {
      return this.$store.getters['users/TRAINERS_SELECT'](this.$auth.user.club.id);
    }
  },
  watch: {
    state (val) {
      if (val) {
        this.trainerId = this.service.last_trainer.id;
      } else {
        this.trainerId = null;
        this.withoutTrainer = false;
        this.description = '';
        this.penaltyDate = null;
      }
    }
  },
  methods: {
    ...mapActions({
      $writeOffVisit: 'clients/writeOffVisit',
      $activateProgram: 'clients/activateProgram',
      $penaltyWriteOffVisit: 'clients/penaltyWriteOffVisit',
    }),
    async _onSubmit () {
      try {
        this.$loader.enable('Пожалуйста, подождите...');
        if (!this.penalty) {
          await this._writeOff();
        } else {
          await this._penaltyWriteOff();
        }
        // Не показывать модальное окно с ключом для босса и детского клуба
        if (!this.IS_BOSS && this.$currentClub !== __hardcoded(3)) {
          this.$emit('submit');
        }
        this.$emit('close');
      } catch (e) {

      } finally {
        this.$loader.disable();
      }
    },
    async _writeOff () {
      if (!this.service.is_activated) {
        await this.$activateProgram(this.service.id);
      }
      await this.$writeOffVisit({
        service_sale_id: this.service.id,
        client_id: this.client.id,
        trainer_id: this.trainerId,
      });
    },
    async _penaltyWriteOff () {
      if (!this.description.length) {
        this.$toast.error('Введите причина!');
        throw null;
      }

      if (!this.penaltyDate) {
        this.$toast.error('Заполните поле дата списания!');
        throw null;
      }

      await this.$penaltyWriteOffVisit({
        service_sale_id: this.service.id,
        client_id: this.client.id,
        trainer_id: this.trainerId,
        description: this.description,
        penalty_date: this.penaltyDate,
      });
    }
  }
}
</script>

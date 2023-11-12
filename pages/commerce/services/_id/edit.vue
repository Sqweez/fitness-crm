<template>
  <div>
    <t-card-page title="Редактирование услуги" v-if="IS_SERVICE_LOADED">
      <v-form ref="form">
        <v-text-field
          ref="name"
          label="Название"
          v-model.trim="service.name"
          :rules="[() => !!service.name || 'Поле название обязательно для заполнения']"
          required
          :error="!!validationErrors.name"
          :error-messages="validationErrors.name"
        />
        <v-select
          ref="service_type_id"
          label="Тип услуги"
          :items="types"
          item-text="name"
          item-value="id"
          v-model="service.service_type_id"
        />
        <v-select
          ref="club_id"
          label="Клуб"
          :items="clubs"
          item-text="name"
          item-value="id"
          v-model="service.club_id"
        />
        <v-text-field
          ref="price"
          type="number"
          label="Стоимость"
          v-model.number="service.price"
          :rules="[() => service.price >= 0 || 'Поле стоимость обязательно для заполнения']"
          :error="!!validationErrors.price"
          :error-messages="validationErrors.price"
        />
        <v-text-field
          v-if="isUnlimited || isProgram"
          ref="prolongation_price"
          type="number"
          label="Стоимость пролонгации"
          v-model.number="service.prolongation_price"
          :error="!!validationErrors.prolongation_price"
          :error-messages="validationErrors.prolongation_price"
        />
        <v-text-field
          v-show="isProgram || isUnlimited"
          ref="unlimited_price"
          type="number"
          label="Стоимость для безлимитчиков"
          hint="Скидочная цена на срок действия основного безлимита, перестает действовать за 7 дней до окончания безлимита"
          persistent-hint
          v-model.number="service.unlimited_price"
          :rules="[() => service.unlimited_price >= 0 || 'Поле стоимость обязательно для заполнения']"
          required
          :error="!!validationErrors.unlimited_price"
          :error-messages="validationErrors.unlimited_price"
        />
        <v-text-field
          v-if="isUnlimited || isProgram"
          ref="restore_price"
          type="number"
          label="Стоимость восстановления"
          v-model.number="service.restore_price"
          :error="!!validationErrors.restore_price"
          :error-messages="validationErrors.restore_price"
        />
        <v-text-field
          v-if="isUnlimited || isProgram"
          ref="validity_days"
          type="number"
          label="Срок действия (в днях)"
          v-model.number="service.validity_days"
          :rules="[() => service.validity_days >= 1 || 'Поле срок действия обязательно для заполнения']"
          required
          :error="!!validationErrors.validity_days"
          :error-messages="validationErrors.validity_days"
        />
        <v-text-field
          v-show="isSolarium"
          ref="validity_minutes"
          type="number"
          label="Срок действия (в минутах)"
          v-model.number="service.validity_minutes"
          :rules="[() => service.validity_minutes >= 1 || 'Поле срок действия обязательно для заполнения']"
          required
          :error="!!validationErrors.validity_minutes"
          :error-messages="validationErrors.validity_minutes"
        />
        <v-text-field
          v-show="isProgram"
          ref="entries_count"
          type="number"
          label="Количество посещений"
          v-model.number="service.entries_count"
          :rules="[() => service.entries_count >= 1 || 'Количество посещений обязательно для заполнения']"
          required
          :error="!!validationErrors.entries_count"
          :error-messages="validationErrors.entries_count"
        />
        <v-textarea
          ref="description"
          label="Описание"
          v-model="service.description"
        />
        <v-btn color="primary" @click="_onSubmit">
          Сохранить <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-form>
    </t-card-page>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {deepClone} from "@/utils/helpers";
import isBossMiddleware from '@/middleware/isBossMiddleware';

export default {
  middleware: [isBossMiddleware],
  data: () => ({
    validationErrors: {},
  }),
  async mounted() {
    this.$loader.enable();
    await this.$getService(this.id);
    this.$loader.disable();
  },
  computed: {
    ...mapGetters({
      _service: 'services/SERVICE',
      types: 'common/SERVICE_TYPES',
      clubs: 'common/CLUBS',
    }),
    isUnlimited () {
      return this.service.service_type_id === 1;
    },
    isProgram () {
      return this.service.service_type_id === 3;
    },
    isSolarium () {
      return this.service.service_type_id === 2;
    },
    service () {
      return deepClone(this._service);
    },
    IS_SERVICE_LOADED () {
      return this._service && this._service.id === this.id;
    },
    id () {
      return +this.$route.params.id;
    },
    form () {
      const form = {
        name: this.service.name,
        club_id: this.service.club_id,
        service_type_id: this.service.service_type_id,
      };

      if (this.isUnlimited) {
        form.validity_days = this.service.validity_days;
      }

      if (this.isSolarium) {
        form.validity_minutes = this.service.validity_minutes;
      }

      if (this.isProgram) {
        form.validity_days = this.service.validity_days;
        form.entries_count = this.service.entries_count;
      }

      return form;
    }
  },
  methods: {
    ...mapActions({
      '$getService': 'services/getService',
      '$editService': 'services/editService'
    }),
    async _onSubmit () {
      if (!this._validateForm()) {
        return false;
      }
      try {
        this.$loader.enable('Пожалуйста, подождите...');
        await this.$editService(this.service);
        this.$loader.disable();
        await this.$router.push('/commerce/services');
      } catch ({ reason, validationErrors }) {
        this.validationErrors = validationErrors;
      }
      finally {
        this.$loader.disable();
      }
    },
    _validateForm () {
      let errors = [];
      this.validationErrors = {};
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) {
          console.log(f);
          errors.push(true);
        }
        this.$refs[f].validate(true);
      })
      console.log(errors);
      return errors.length === 0;
    },
  }
}
</script>

<style scoped lang="scss">

</style>

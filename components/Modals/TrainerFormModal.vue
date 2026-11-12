<template>
  <base-modal
    :state="true"
    :title="trainer ? 'Редактирование тренера' : 'Добавление тренера'"
    :max-width="600"
    :persistent="saving"
    @close="$emit('close')"
  >
    <v-form ref="form" :disabled="saving" @submit.prevent="save">
      <v-text-field
        v-model.trim="form.first_name"
        label="Имя"
        maxlength="255"
        :rules="textRules"
        :error-messages="validationErrors.first_name"
        @input="clearError('first_name')"
      />
      <v-text-field
        v-model.trim="form.last_name"
        label="Фамилия"
        maxlength="255"
        :rules="textRules"
        :error-messages="validationErrors.last_name"
        @input="clearError('last_name')"
      />
      <v-text-field
        v-model.trim="form.specialization"
        label="Специализация"
        maxlength="255"
        :rules="textRules"
        :error-messages="validationErrors.specialization"
        @input="clearError('specialization')"
      />
      <v-text-field
        v-model.number="form.sort_order"
        label="Порядок отображения"
        type="number"
        min="0"
        max="4294967295"
        step="1"
        :rules="[value => Number.isInteger(value) && value >= 0 && value <= 4294967295 || 'Введите целое число от 0 до 4294967295']"
        :error-messages="validationErrors.sort_order"
        @input="clearError('sort_order')"
      />
      <v-switch
        v-model="form.is_active"
        label="Показывать в приложении"
        :error-messages="validationErrors.is_active"
        @change="clearError('is_active')"
      />
      <v-img v-if="previewUrl" :src="previewUrl" alt="Фотография тренера" width="160" height="160" class="rounded mb-3" />
      <v-file-input
        v-model="photo"
        label="Фотография"
        accept="image/jpeg,image/png"
        show-size
        :rules="photoRules"
        :error-messages="validationErrors.photo"
        hint="JPEG или PNG, до 5 МБ"
        persistent-hint
        @change="clearError('photo')"
      />
      <v-btn v-if="previewUrl" text color="error" :disabled="saving" @click="removePhoto">
        Удалить фото
      </v-btn>
      <p v-if="photoRemoved" class="text-sm text-slate-500 mt-2">Фото будет удалено после сохранения.</p>
    </v-form>
    <template #actions>
      <v-btn text :disabled="saving" @click="$emit('close')">Отмена</v-btn>
      <v-spacer />
      <v-btn color="primary" :loading="saving" :disabled="saving" @click="save">
        Сохранить <Check :size="18" class="ml-1" />
      </v-btn>
    </template>
  </base-modal>
</template>

<script>
import { Check } from 'lucide-vue';

export default {
  components: { Check },
  props: {
    trainer: { type: Object, default: null },
  },
  data () {
    return {
      form: {
        first_name: this.trainer ? this.trainer.first_name : '',
        last_name: this.trainer ? this.trainer.last_name : '',
        specialization: this.trainer ? this.trainer.specialization : '',
        sort_order: this.trainer ? this.trainer.sort_order : 0,
        is_active: this.trainer ? this.trainer.is_active : true,
      },
      photo: null,
      selectedPhotoUrl: null,
      photoRemoved: false,
      saving: false,
      validationErrors: {},
      textRules: [
        value => !!value.trim() || 'Обязательное поле',
        value => value.length <= 255 || 'Максимум 255 символов',
      ],
      photoRules: [
        file => !file || ['image/jpeg', 'image/png'].includes(file.type) || 'Выберите JPEG или PNG',
        file => !file || file.size <= 5 * 1024 * 1024 || 'Размер фото не должен превышать 5 МБ',
      ],
    };
  },
  computed: {
    previewUrl () {
      return this.selectedPhotoUrl || (!this.photoRemoved && this.trainer ? this.trainer.photo_url : null);
    },
  },
  watch: {
    photo (file) {
      this.releasePreview();
      if (file && this.photoRules.every(rule => rule(file) === true)) {
        this.selectedPhotoUrl = URL.createObjectURL(file);
      }
    },
  },
  beforeDestroy () {
    this.releasePreview();
  },
  methods: {
    clearError (field) {
      this.$delete(this.validationErrors, field);
    },
    releasePreview () {
      if (this.selectedPhotoUrl) {
        URL.revokeObjectURL(this.selectedPhotoUrl);
        this.selectedPhotoUrl = null;
      }
    },
    removePhoto () {
      this.photo = null;
      this.photoRemoved = true;
      this.clearError('photo');
    },
    async save () {
      if (this.saving) return;
      this.validationErrors = {};
      if (!this.$refs.form.validate()) return;

      const fields = {};
      Object.keys(this.form).forEach(key => {
        if (!this.trainer || this.form[key] !== this.trainer[key]) {
          fields[key] = this.form[key];
        }
      });
      if (this.photoRemoved && !this.photo) {
        fields.photo = null;
      }

      this.saving = true;
      try {
        const payload = { fields, photo: this.photo };
        if (this.trainer) {
          await this.$store.dispatch('trainers/editTrainer', { ...payload, id: this.trainer.id });
        } else {
          await this.$store.dispatch('trainers/createTrainer', payload);
        }
        this.$toast.success(this.trainer ? 'Тренер сохранён' : 'Тренер добавлен');
        this.$emit('saved');
      } catch ({ validationErrors }) {
        this.validationErrors = validationErrors;
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

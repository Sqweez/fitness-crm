<template>
  <v-form ref="form" :disabled="saving" @submit.prevent="save">
    <v-text-field :value="club.name" label="Название клуба" readonly />

    <v-img v-if="previewUrl" :src="previewUrl" alt="Фотография клуба" max-width="320" height="180" class="rounded mb-3" />
    <v-file-input
      v-model="cover"
      label="Фотография"
      accept="image/jpeg,image/png"
      show-size
      :rules="coverRules"
      :error-messages="validationErrors.cover"
      hint="JPG или PNG, до 5 МБ"
      persistent-hint
      @change="clearError('cover')"
    />
    <v-btn v-if="previewUrl" text color="error" :disabled="saving" @click="removeCover">
      Удалить фото
    </v-btn>
    <p v-if="coverRemoved" class="text-sm text-slate-500 mt-2">Фото будет удалено после сохранения.</p>

    <v-text-field
      v-model.trim="form.address"
      label="Адрес"
      maxlength="255"
      :rules="[maxLength(255)]"
      :error-messages="validationErrors.address"
      class="mt-4"
      @input="clearError('address')"
    />
    <v-text-field
      v-model.trim="form.map_url"
      label="Ссылка на карту"
      maxlength="2048"
      placeholder="https://..."
      :rules="[maxLength(2048), value => !value || /^https?:\/\/\S+$/i.test(value) || 'Введите ссылку, начинающуюся с http:// или https://']"
      :error-messages="validationErrors.map_url"
      @input="clearError('map_url')"
    />

    <div class="mt-4">
      <div class="text-base font-medium mb-2">Расписание</div>
      <v-alert v-if="validationErrors.schedule" type="error" text dense>{{ validationErrors.schedule }}</v-alert>
      <div v-for="(row, index) in form.schedule" :key="row.key" class="flex gap-3 items-start">
        <v-text-field
          v-model.trim="row.days"
          label="Дни"
          placeholder="Пн–Пт"
          maxlength="100"
          :rules="[required, maxLength(100)]"
          :error-messages="validationErrors[`schedule.${index}.days`]"
          @input="clearError(`schedule.${index}.days`)"
        />
        <v-text-field
          v-model.trim="row.hours"
          label="Часы"
          placeholder="08:00–22:00"
          maxlength="100"
          :rules="[required, maxLength(100)]"
          :error-messages="validationErrors[`schedule.${index}.hours`]"
          @input="clearError(`schedule.${index}.hours`)"
        />
        <v-btn
          icon
          :aria-label="`Удалить строку расписания ${index + 1}`"
          :disabled="saving"
          class="text-red-500 hover:bg-red-50 mt-3"
          @click="removeScheduleRow(index)"
        ><Trash2 :size="18" /></v-btn>
      </div>
      <v-btn text color="primary" :disabled="saving || form.schedule.length >= 14" @click="addScheduleRow">
        Добавить строку <Plus :size="18" class="ml-1" />
      </v-btn>
    </div>

    <v-text-field
      v-model.trim="form.phone"
      label="Телефон"
      maxlength="32"
      placeholder="+7 (775) 876-11-11"
      :rules="[maxLength(32), value => !value || /^\+?[\d\s()-]+$/.test(value) || 'Допустимы цифры, ведущий плюс, пробелы, скобки и дефисы']"
      :error-messages="validationErrors.phone"
      class="mt-4"
      @input="clearError('phone')"
    />
    <v-text-field
      v-model.trim="form.whatsapp"
      label="WhatsApp"
      maxlength="15"
      placeholder="77758761111"
      :rules="[value => !value || /^\d{7,15}$/.test(value) || 'От 7 до 15 цифр, без плюса']"
      :error-messages="validationErrors.whatsapp"
      @input="clearError('whatsapp')"
    />
    <v-text-field
      v-model.trim="form.instagram"
      label="Instagram"
      maxlength="30"
      prefix="@"
      :rules="[value => !value || /^[A-Za-z0-9._]{1,30}$/.test(value) || 'Латинские буквы, цифры, точки и подчёркивания, до 30 символов']"
      :error-messages="validationErrors.instagram"
      @input="clearError('instagram')"
    />

    <div class="flex flex-wrap gap-3 mt-6">
      <v-btn color="primary" type="submit" :loading="saving" :disabled="saving">
        Сохранить <Check :size="18" class="ml-1" />
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { Check, Plus, Trash2 } from 'lucide-vue';

const TEXT_FIELDS = ['address', 'map_url', 'phone', 'whatsapp', 'instagram'];

let scheduleKey = 0;
const scheduleRow = ({ days, hours }) => ({ key: ++scheduleKey, days, hours });

const formFromClub = club => ({
  ...Object.fromEntries(TEXT_FIELDS.map(field => [field, club[field] || ''])),
  schedule: club.schedule.map(scheduleRow),
});

export default {
  components: { Check, Plus, Trash2 },
  props: {
    initialClub: { type: Object, required: true },
  },
  data () {
    return {
      club: this.initialClub,
      form: formFromClub(this.initialClub),
      cover: null,
      selectedCoverUrl: null,
      coverRemoved: false,
      saving: false,
      validationErrors: {},
      coverRules: [
        file => !file || ['image/jpeg', 'image/png'].includes(file.type) || 'Выберите JPG или PNG',
        file => !file || file.size <= 5 * 1024 * 1024 || 'Размер фото не должен превышать 5 МБ',
      ],
    };
  },
  computed: {
    previewUrl () {
      return this.selectedCoverUrl || (!this.coverRemoved ? this.club.cover_url : null);
    },
  },
  watch: {
    cover (file) {
      this.releasePreview();
      if (file && this.coverRules.every(rule => rule(file) === true)) {
        this.selectedCoverUrl = URL.createObjectURL(file);
      }
    },
  },
  beforeDestroy () {
    this.releasePreview();
  },
  methods: {
    required: value => !!value || 'Обязательное поле',
    maxLength: max => value => !value || value.length <= max || `Максимум ${max} символов`,
    clearError (field) {
      this.$delete(this.validationErrors, field);
    },
    releasePreview () {
      if (this.selectedCoverUrl) {
        URL.revokeObjectURL(this.selectedCoverUrl);
        this.selectedCoverUrl = null;
      }
    },
    removeCover () {
      this.cover = null;
      this.coverRemoved = true;
      this.clearError('cover');
    },
    addScheduleRow () {
      this.form.schedule.push(scheduleRow({ days: '', hours: '' }));
    },
    removeScheduleRow (index) {
      this.form.schedule.splice(index, 1);
      // Server errors for schedule rows are index-based and become stale after removal
      Object.keys(this.validationErrors)
        .filter(key => key.startsWith('schedule'))
        .forEach(key => this.clearError(key));
    },
    changedFields () {
      const fields = {};
      TEXT_FIELDS.forEach(field => {
        const value = this.form[field] || null;
        if (value !== this.club[field]) {
          fields[field] = value;
        }
      });
      const schedule = this.form.schedule.map(({ days, hours }) => ({ days, hours }));
      if (JSON.stringify(schedule) !== JSON.stringify(this.club.schedule)) {
        fields.schedule = schedule;
      }
      if (this.coverRemoved && !this.cover) {
        fields.cover = null;
      }
      return fields;
    },
    async save () {
      if (this.saving) return;
      this.validationErrors = {};
      if (!this.$refs.form.validate()) return;

      const fields = this.changedFields();
      this.saving = true;
      try {
        if (Object.keys(fields).length) {
          this.club = await this.$store.dispatch('clubProfiles/editClubProfile', { clubId: this.club.id, fields });
        }
        if (this.cover) {
          this.club = await this.$store.dispatch('clubProfiles/uploadClubCover', { clubId: this.club.id, cover: this.cover });
          this.cover = null;
        }
        this.coverRemoved = false;
        this.$toast.success('Информация о клубе сохранена');
      } catch ({ validationErrors }) {
        this.validationErrors = validationErrors;
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

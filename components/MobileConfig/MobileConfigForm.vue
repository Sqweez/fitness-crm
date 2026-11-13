<template>
  <v-form ref="form" :disabled="saving" @submit.prevent="save">
    <h3 class="text-lg font-medium mb-1">Контакты</h3>
    <p class="text-sm text-slate-500 mb-3">Шторка «Связаться с клубом» в приложении. Порядок совпадает с порядком в приложении.</p>
    <div v-for="(contact, index) in form.contacts" :key="contact.key" class="flex gap-3 items-start">
      <v-text-field
        v-model.trim="contact.title"
        label="Название"
        maxlength="255"
        :rules="[required, maxLength(255)]"
        :error-messages="validationErrors[`contacts.${index}.title`]"
        class="flex-1"
        @input="clearError(`contacts.${index}.title`)"
      />
      <v-text-field
        v-model.trim="contact.url"
        label="Ссылка"
        maxlength="2048"
        placeholder="tel:+77758761111"
        hint="Для мессенджеров используйте https-ссылки (wa.me, t.me), а не whatsapp:// или tg://"
        :rules="[required, maxLength(2048), value => !value || /^[a-z][a-z0-9+.-]*:\S+$/i.test(value) || 'Укажите ссылку со схемой: tel:, https:// и т.п.']"
        :error-messages="validationErrors[`contacts.${index}.url`]"
        class="flex-[2]"
        @input="clearError(`contacts.${index}.url`)"
      />
      <div class="flex mt-3">
        <v-btn icon :aria-label="`Поднять контакт ${index + 1}`" :disabled="saving || index === 0" @click="moveContact(index, -1)">
          <ChevronUp :size="18" />
        </v-btn>
        <v-btn
          icon
          :aria-label="`Опустить контакт ${index + 1}`"
          :disabled="saving || index === form.contacts.length - 1"
          @click="moveContact(index, 1)"
        >
          <ChevronDown :size="18" />
        </v-btn>
        <v-btn
          icon
          :aria-label="`Удалить контакт ${index + 1}`"
          :disabled="saving || form.contacts.length === 1"
          class="text-red-500 hover:bg-red-50"
          @click="removeContact(index)"
        >
          <Trash2 :size="18" />
        </v-btn>
      </div>
    </div>
    <v-alert v-if="validationErrors.contacts" type="error" text dense>{{ validationErrors.contacts }}</v-alert>
    <v-btn text color="primary" :disabled="saving" @click="addContact">
      Добавить контакт <Plus :size="18" class="ml-1" />
    </v-btn>

    <h3 class="text-lg font-medium mt-8 mb-3">Приложение</h3>
    <v-text-field
      v-model.trim="form.app.min_version"
      label="Минимальная версия"
      placeholder="1.0.0"
      maxlength="32"
      hint="Пользователи с более старой версией не смогут пользоваться приложением, пока не обновят его"
      persistent-hint
      :rules="[required, value => /^\d+\.\d+\.\d+$/.test(value) || 'Формат X.Y.Z, например 1.2.0']"
      :error-messages="validationErrors['app.min_version']"
      @input="clearError('app.min_version')"
    />
    <v-alert v-if="minVersionRaisedWithoutStore" type="warning" text dense class="mt-4">
      Минимальная версия повышается, но ссылка на магазин не заполнена: пользователям будет нечем обновиться.
    </v-alert>
    <v-text-field
      v-model.trim="form.app.store_url.ios"
      label="Ссылка в App Store"
      maxlength="2048"
      :rules="storeUrlRules"
      :error-messages="validationErrors['app.store_url.ios']"
      class="mt-4"
      @input="clearError('app.store_url.ios')"
    />
    <p v-if="form.app.store_url.ios === '#'" class="flex items-center gap-1 text-sm text-amber-600 -mt-3 mb-3">
      <TriangleAlert :size="16" /> Ссылка не заполнена
    </p>
    <v-text-field
      v-model.trim="form.app.store_url.android"
      label="Ссылка в Google Play"
      maxlength="2048"
      :rules="storeUrlRules"
      :error-messages="validationErrors['app.store_url.android']"
      @input="clearError('app.store_url.android')"
    />
    <p v-if="form.app.store_url.android === '#'" class="flex items-center gap-1 text-sm text-amber-600 -mt-3 mb-3">
      <TriangleAlert :size="16" /> Ссылка не заполнена
    </p>

    <h3 class="text-lg font-medium mt-8 mb-1">Технические работы</h3>
    <v-switch
      v-model="form.maintenance.enabled"
      label="Включить технические работы"
      :error-messages="validationErrors['maintenance.enabled']"
      @change="clearError('maintenance.enabled')"
    />
    <v-textarea
      v-model.trim="form.maintenance.message"
      label="Сообщение для пользователей"
      maxlength="2000"
      counter="2000"
      rows="3"
      auto-grow
      :rules="[value => !form.maintenance.enabled || !!value || 'Обязательно при включённых технических работах', maxLength(2000)]"
      :error-messages="validationErrors['maintenance.message']"
      @input="clearError('maintenance.message')"
    />

    <h3 class="text-lg font-medium mt-8 mb-3">Ссылки</h3>
    <v-text-field
      v-model.trim="form.links.privacy_policy"
      label="Политика конфиденциальности"
      maxlength="2048"
      :rules="storeUrlRules"
      :error-messages="validationErrors['links.privacy_policy']"
      @input="clearError('links.privacy_policy')"
    />
    <p v-if="form.links.privacy_policy === '#'" class="flex items-center gap-1 text-sm text-amber-600 -mt-3 mb-3">
      <TriangleAlert :size="16" /> Ссылка не заполнена
    </p>

    <div class="flex flex-wrap gap-3 mt-8">
      <v-btn color="primary" type="submit" :loading="saving" :disabled="saving">
        Сохранить <Check :size="18" class="ml-1" />
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { Check, ChevronDown, ChevronUp, Plus, Trash2, TriangleAlert } from 'lucide-vue';

let contactKey = 0;
const contactRow = ({ title, url }) => ({ key: ++contactKey, title, url });

const formFromConfig = config => ({
  contacts: config.contacts.map(contactRow),
  app: {
    min_version: config.app.min_version,
    store_url: { ...config.app.store_url },
  },
  maintenance: {
    enabled: config.maintenance.enabled,
    message: config.maintenance.message || '',
  },
  links: { ...config.links },
});

// Returns a positive number when version a is greater than b (both in X.Y.Z format)
const compareVersions = (a, b) => {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  return left.map((part, index) => part - right[index]).find(diff => diff !== 0) || 0;
};

export default {
  components: { Check, ChevronDown, ChevronUp, Plus, Trash2, TriangleAlert },
  props: {
    initialConfig: { type: Object, required: true },
  },
  data () {
    return {
      config: this.initialConfig,
      form: formFromConfig(this.initialConfig),
      saving: false,
      validationErrors: {},
      storeUrlRules: [
        value => !!value || 'Обязательное поле',
        value => value.length <= 2048 || 'Максимум 2048 символов',
        value => /^(?:#|https?:\/\/\S+)$/.test(value) || 'Укажите http(s)-ссылку или «#»',
      ],
    };
  },
  computed: {
    minVersionRaisedWithoutStore () {
      const { min_version: version, store_url: storeUrl } = this.form.app;
      return /^\d+\.\d+\.\d+$/.test(version)
        && compareVersions(version, this.config.app.min_version) > 0
        && (storeUrl.ios === '#' || storeUrl.android === '#');
    },
  },
  methods: {
    required: value => !!value || 'Обязательное поле',
    maxLength: max => value => !value || value.length <= max || `Максимум ${max} символов`,
    clearError (field) {
      this.$delete(this.validationErrors, field);
    },
    // Server errors for contacts are index-based and become stale after reordering
    clearContactErrors () {
      Object.keys(this.validationErrors)
        .filter(key => key.startsWith('contacts'))
        .forEach(key => this.clearError(key));
    },
    addContact () {
      this.form.contacts.push(contactRow({ title: '', url: '' }));
    },
    removeContact (index) {
      this.form.contacts.splice(index, 1);
      this.clearContactErrors();
    },
    moveContact (index, offset) {
      const [contact] = this.form.contacts.splice(index, 1);
      this.form.contacts.splice(index + offset, 0, contact);
      this.clearContactErrors();
    },
    async confirmMaintenance () {
      return this.$confirm(
        'При включённых технических работах приложение покажет это сообщение вместо интерфейса всем пользователям.',
        'Включить технические работы?'
      ).catch(cancelled => {
        if (cancelled !== false) throw cancelled;
        return false;
      });
    },
    async save () {
      if (this.saving) return;
      this.validationErrors = {};
      if (!this.$refs.form.validate()) return;

      this.saving = true;
      try {
        if (this.form.maintenance.enabled && !this.config.maintenance.enabled && !await this.confirmMaintenance()) {
          return;
        }
        const { contacts, app, maintenance, links } = this.form;
        this.config = await this.$store.dispatch('mobileConfig/updateConfig', {
          contacts: contacts.map(({ title, url }) => ({ title, url })),
          app,
          maintenance: { enabled: maintenance.enabled, message: maintenance.message || null },
          links,
        });
        this.form = formFromConfig(this.config);
        this.$toast.success('Настройки приложения сохранены');
      } catch ({ validationErrors }) {
        this.validationErrors = validationErrors;
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>


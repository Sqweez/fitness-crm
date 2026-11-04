<template>
  <div>
    <slot v-if="loaded" name="totals" :totals="totals" />
    <v-text-field
      v-model="search"
      label="Поиск по клиенту"
      single-line
      hide-details
      clearable
    >
      <template v-slot:append>
        <Search :size="20" class="text-gray-400" />
      </template>
    </v-text-field>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :options.sync="options"
      :server-items-length="total"
      :footer-props="{ 'items-per-page-options': [10, 25, 50, 100] }"
      disable-sort
      @click:row="(row) => $emit('click:row', row)"
    >
      <template v-for="name in itemSlots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { Search } from 'lucide-vue';
import { __debounce } from '@/utils/helpers';

export default {
  components: { Search },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    params: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    search: '',
    items: [],
    total: 0,
    totals: {},
    loaded: false,
    loading: false,
    requestId: 0,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  computed: {
    // the table re-emits equal option objects, so watch the value instead of the reference
    pageKey () {
      return `${this.options.page}:${this.options.itemsPerPage}`;
    },
    itemSlots () {
      return Object.keys(this.$scopedSlots).filter(name => name.startsWith('item.'));
    },
  },
  watch: {
    pageKey: 'load',
    params: 'reload',
    search () {
      this.debouncedReload();
    },
  },
  created () {
    this.debouncedReload = __debounce(this.reload, 400);
  },
  mounted () {
    this.load();
  },
  methods: {
    reload () {
      if (this.options.page !== 1) {
        // the options watcher loads the first page
        this.options = { ...this.options, page: 1 };
        return;
      }
      this.load();
    },
    async load () {
      const requestId = ++this.requestId;
      this.loading = true;
      try {
        const data = await this.$axios.$get(`v2/economy/${this.endpoint}`, {
          params: {
            ...this.params,
            search: this.search || undefined,
            page: this.options.page,
            per_page: this.options.itemsPerPage,
          },
        });
        if (requestId !== this.requestId) {
          return;
        }
        this.items = data.data;
        this.total = data.meta.total;
        this.totals = data.totals;
        this.loaded = true;
      } finally {
        if (requestId === this.requestId) {
          this.loading = false;
        }
      }
    },
  },
}
</script>

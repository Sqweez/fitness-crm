import {__hardcoded} from '@/utils/helpers';

export const state = () => ({
  products: [],
  product: null,
  categories: [],
  searchedShopProducts: [],
  searchedBarProducts: [],
});
export const getters = {
  products: s => s.products,
  shopProducts: s => s.products.filter(p => p.product_type_id === 1),
  barProducts: s => s.products.filter(p => p.product_type_id === 2),
  product: s => s.product,
  categories: s => s.categories,
  categoryFilters: s => [ {id: -1, name: 'Все'}, ...s.categories ],
  searchedShopProducts: s => s.searchedShopProducts,
  searchedBarProducts: s => s.searchedBarProducts,
};
export const mutations = {
  setProducts (state, products) {
    state.products = products;
  },
  setProduct (state, product) {
    state.product = product;
  },
  createProduct (state, product) {
    state.products.push(product);
  },
  deleteProduct (state, productId) {
    state.products = state.products.filter(p => p.id !== productId);
  },
  updateProduct (state, product) {
    state.products = state.products.map(p => {
      if (p.id === product.id) {
        p = {
          ...p,
          ...product
        };
      }
      return p;
    });
  },
  setCategories (state, categories) {
    state.categories = categories;
  },
  createCategory (state, category) {
    state.categories.push(category);
  },
  setSearchedBarProducts (state, products) {
    state.searchedBarProducts = products;
  },
  setSearchedShopProducts (state, products) {
    state.searchedShopProducts = products;
  },
};
export const actions = {
  async getCategories ({ commit }) {
    const { data: { categories } } = await this.$axios.get(`/v1/products/categories`);
    commit('setCategories', categories);
  },
  async createCategory ({ commit }, payload) {
    const { data } = await this.$axios.post(`/v1/products/categories`, payload);
    commit('createCategory', data.category);
    return data.category;
  },
  async createProduct ({ commit }, payload) {
    const { data } = await this.$axios.post(`/v1/products`, payload);
    commit('createProduct', data.product);
  },
  async updateProduct ({ commit }, payload) {
    const data = await this.$axios.patch(`/v1/products/${payload.id}`, payload);
    commit('updateProduct', data);
  },
  async getProducts ({ commit }, store_id = null) {
    let queryString = store_id ? `store_id=${store_id}` : '';
    const { data } = await this.$axios.get(`v1/products?${queryString}`);
    commit('setProducts', data.data);
  },
  async deleteProduct ({commit}, product_id) {
    await this.$axios.delete(`v1/products/${product_id}`);
    commit('deleteProduct', product_id);
  },
  async createProductBatch ({ commit }, payload) {
    const { data: { quantities } } = await this.$axios.post(`v1/products/${payload.id}/batch`, payload);
    commit('updateProduct', {
      quantity: quantities,
      id: payload.id,
    })
  },
  async getProductBatchInformation ({ commit }, id) {
    const { data: { data } } = await this.$axios.get(`v1/products/${id}/batch`);
    return data;
  },
  async searchProducts ({ commit }, { search, type, store_id }) {
    const payload = {
      search,
      type,
      store_id
    };
    const { data: { data } } = await this.$axios.get(`v1/products/search?${new URLSearchParams(payload)}`);
    if (type === __hardcoded(1)) {
      commit('setSearchedShopProducts', data);
    } else {
      commit('setSearchedBarProducts', data);
    }
  }
};

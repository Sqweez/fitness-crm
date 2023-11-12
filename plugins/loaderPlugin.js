import Vue from 'vue';

export default ({ app, store }, inject) => {
  const LoaderService = {
    enable (msg = null) {
      if (msg) {
        store.commit('utils/setLoaderMessage', msg);
      }
      store.dispatch('utils/setLoading', true);
    },
    disable () {
      store.dispatch('utils/setLoading', false);
    },
    toggle () {
      store.dispatch('utils/toggleLoading');
    },
    toggleWithFlag (flag) {
      if (flag === true) {
        this.enable()
      } else if (flag === false) {
        this.disable()
      } else {
        store.dispatch('utils/toggleLoading');
      }
    }
  };

  Vue.prototype.$loader = LoaderService;
  inject('loader', LoaderService);
}

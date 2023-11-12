import ConfirmationModal from "~/components/Modals/ConfirmationModal";
import Vue from 'vue'
import Vuetify from "vuetify";
Vue.use(Vuetify);

/* @link https://stackoverflow.com/questions/63540262/vue-nuxt-how-to-access-parents-ref-from-child-components */
export default function (ctx, inject) {
  const $confirm = (text = 'Подтвердите действие', title = 'Подтвердите действие', options = {}) => {
    return new Promise((resolve, reject) => {
      try {
        let state = true;
        const props = {
          title, text, options, state,
        };
        const on = {};
        const comp = new Vue({
          store: ctx.store,
          vuetify: new Vuetify({
            theme: {
              themes: {
                light: {
                  primary: '#43A047'
                }
              }
            }
          }),
          render: (h) => h(ConfirmationModal, {props, on}),
        });

        on.confirmed = (val) => {
          if (val) {
            resolve(val);
          } else {
            reject(false);
          }
          window.setTimeout(() => comp.$destroy(), 100);
        };

        comp.$mount();
        document.getElementById('app').appendChild(comp.$el);
      } catch (err) {
        reject(err);
      }
    });
  };

  Vue.prototype.$confirm = $confirm;
  inject('$confirm', $confirm);
}

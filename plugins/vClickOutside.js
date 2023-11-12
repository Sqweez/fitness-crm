import Vue from 'vue'
import vClickOutside from 'v-click-outside'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(vClickOutside)
Vue.directive('click-outside', vClickOutside);

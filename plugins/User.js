import Vue from "vue";
import {__hardcoded, formatPrice} from '@/utils/helpers';
import Login from '@/pages/login';

export default (ctx, inject) => {
  Vue.filter('priceFilters', value => {
    return formatPrice(value);
  });

  Vue.filter('priceFiltersRub', value => {
    return `${new Intl.NumberFormat('ru-RU').format(Math.ceil(value))} ₽`;
  });
}

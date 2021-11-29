import Vue from 'vue';
import zds from '@zoov/design-system';
import { createPinia, PiniaVuePlugin } from 'pinia';

import App from './App.vue';
import * as components from '@zoov/design-system/src/components';

Vue.use(zds, { components });
Vue.use(PiniaVuePlugin);

const pinia = createPinia();

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount('#app');

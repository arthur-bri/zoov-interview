import { defineStore } from 'pinia';

export const bikeStore = defineStore('main', {
  state: () => {
    return {
      bikes: [],
      totalBikes: 0,
      selectedBike: null,
      showBikeManager: false,
      filterQueryString: '',
    };
  },
});

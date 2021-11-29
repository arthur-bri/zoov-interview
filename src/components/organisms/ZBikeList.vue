<template>
  <div class="z-bike-list">
    <z-bike-list-item
      v-for="bike in bikes"
      :key="bike.id"
      :bike="bike"
      :selected="selectedBike === bike.id"
      @selection="selectBike(bike.id)"
    />
  </div>
</template>

<script>
import { bikeStore } from '../../store';
import { mapState, mapWritableState } from 'pinia';
import ZBikeListItem from '../molecules/ZBikeListItem.vue';

export default {
  name: 'ZBikeList',
  components: { ZBikeListItem },
  computed: {
    ...mapState(bikeStore, ['bikes']),
    ...mapWritableState(bikeStore, ['selectedBike']),
  },
  methods: {
    isSelected(bikeId) {
      return this.selectedBike === bikeId;
    },
    selectBike(bikeId) {
      this.selectedBike = bikeId;
    },
  },
};
</script>

<style lang="stylus" scoped>
.z-bike-list
  overflow scroll

  > div + div
    margin-top 12px
</style>

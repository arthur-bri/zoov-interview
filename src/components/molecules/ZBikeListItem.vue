<template>
  <z-card @click="$emit('selection', bike.id)" class="z-bike-list-item" :class="selected && 'selected'">
    <div class="z-bike-list-item__technical-infos">
      <z-icon size="50px">zoov-bike</z-icon>
      <span>{{ bike.serial_number }}</span>
      <div class="z-bike-list-item__in-order">
        <z-button v-if="bike.in_order" color="success" class="z-bike-list-item__in-order-button" tiny icon><z-icon>bolt</z-icon></z-button>
        <z-button v-else color="danger" class="z-bike-list-item__in-order-button" tiny icon><z-icon>close</z-icon></z-button>
      </div>
    </div>
    <z-battery-indicator :batteryLevel="bike.battery_level" :colored="false" class="z-bike-list-item__battery-indicator" />
    <z-bike-service-status :serviceStatus="bike.service_status" class="z-bike-list-item__service-status" />
    <z-button class="z-bike-list-item__manage-button" tiny @click="manageBike">
      Manage
      <z-icon>sliders</z-icon>
    </z-button>
  </z-card>
</template>

<script>
import { bikeStore } from '../../store';
import { mapWritableState } from 'pinia';

import ZBatteryIndicator from '../atoms/ZBatteryIndicator.vue';
import ZBikeServiceStatus from '../atoms/ZBikeServiceStatus.vue';

export default {
  components: { ZBatteryIndicator, ZBikeServiceStatus },
  name: 'ZBikeListItem',
  props: {
    bike: Object,
    selected: Boolean,
  },
  computed: {
    ...mapWritableState(bikeStore, ['selectedBike', 'showBikeManager']),
  },
  methods: {
    manageBike() {
      this.selectedBike = this.bike.id;
      this.showBikeManager = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
.selected
  &::before
    content ''
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    border-radius inherit
    border 2px solid $colors.primary.base

.z-bike-list-item
  position relative
  display flex
  cursor pointer

.z-bike-list-item__technical-infos
  display flex
  flex-direction column
  align-content center
  position relative

.z-bike-list-item__service-status
  position absolute
  bottom 16px
  right 16px

.z-bike-list-item__battery-indicator
  position absolute
  bottom 16px
  left 50%
  transform translateX(-50%)

.z-bike-list-item__in-order
  position absolute
  right -8px
  bottom 24px

  &-button
    box-shadow 0 0 0px 2px rgba($colors.white.base, 1)

.z-bike-list-item__manage-button
  position absolute
  top 16px
  right 16px
</style>

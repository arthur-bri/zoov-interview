<template>
  <div class="z-map-popup">
    <div class="z-map-popup__bike-wrapper">
      <div class="z-map-popup__bike-stats">
        <z-bike-service-status :serviceStatus="bike.service_status" />
        <z-battery-indicator :batteryLevel="bike.battery_level" showText />
      </div>
      <div>
        <div class="z-map-popup__bike-infos">
          <div class="z-map-popup__serial-number">
            <z-icon size="60px">zoov-bike</z-icon>
            <span>{{ bike.serial_number }}</span>
            <div class="z-map-popup__in-order">
              <z-tooltip valign="top" halign="center">
                <template v-slot:activator>
                  <z-button v-if="bike.in_order" color="success" class="z-map-popup__in-order-button" tiny icon
                    ><z-icon>bolt</z-icon></z-button
                  >
                  <z-button v-else color="danger" class="z-map-popup__in-order-button" tiny icon><z-icon>close</z-icon></z-button>
                </template>
                <span v-if="bike.in_order" class="text--success">In service</span>
                <span v-else class="text--danger">Out of service</span>
              </z-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="z-map-popup__actions">
      <z-button color="neutral--darken" tiny @click="$emit('manage', bike.id)">
        <span>Manage</span>
        <z-icon>sliders</z-icon>
      </z-button>
    </div>
  </div>
</template>

<script>
import ZBatteryIndicator from '../atoms/ZBatteryIndicator.vue';
import ZBikeServiceStatus from '../atoms/ZBikeServiceStatus.vue';

export default {
  name: 'ZMapPopup',
  props: {
    bike: Object,
  },
  components: { ZBatteryIndicator, ZBikeServiceStatus },
};
</script>

<style lang="stylus">
.z-map-popup
  background white
  padding 10px

.z-map-popup__bike-wrapper
  display flex
  flex-direction column
  min-width 140px

.z-map-popup__bike-status
  display flex
  flex-direction column
  align-items center
  justify-content center

.z-map-popup__bike-stats
  display flex
  align-items center
  justify-content space-between

  > * + *
    padding-left 20px

.z-map-popup__bike-infos
  display flex
  align-items center
  justify-content center

.z-map-popup__serial-number
  display flex
  flex-direction column
  align-items center
  position relative

.z-map-popup__actions
  padding 6px
  text-align center

.z-map-popup__in-order
  position absolute
  right -8px
  bottom 24px
  white-space nowrap

  &-button
    box-shadow 0 0 0px 2px rgba($colors.white.base, 1)
</style>

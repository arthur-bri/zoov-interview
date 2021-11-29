<template>
  <div class="z-map-popup__battery-infos">
    <z-icon :color="batteryIconLevel.color">battery-{{ batteryIconLevel.icon }}</z-icon>
    <span v-if="showText">{{ batteryLevel }}%</span>
  </div>
</template>

<script>
export default {
  name: 'ZBatteryIndicator',
  props: {
    batteryLevel: Number,
    showText: {
      type: Boolean,
      default: true,
    },
    colored: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    batteryIconLevel() {
      let batteryLevel = {};
      if (this.batteryLevel > 80) {
        batteryLevel = {
          icon: 'full',
          color: 'success--dark-1',
        };
      } else if (this.batteryLevel > 60) {
        batteryLevel = {
          icon: 'three-quarters',
          color: 'success',
        };
      } else if (this.batteryLevel > 40) {
        batteryLevel = {
          icon: 'half',
          color: 'info',
        };
      } else if (this.batteryLevel > 10) {
        batteryLevel = {
          icon: 'quarter',
          color: 'warning',
        };
      } else {
        batteryLevel = {
          icon: 'empty',
          color: 'danger',
        };
      }
      return {
        icon: batteryLevel.icon,
        color: this.colored ? batteryLevel.color : 'neutral',
      };
    },
  },
};
</script>

<style lang="stylus">
.z-map-popup__battery-infos
  display flex
  align-items center
  font-size 0.8em

  > * + *
    padding-left 4px
</style>

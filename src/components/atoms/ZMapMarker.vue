<template>
  <div class="zmap-marker" @click="$emit('selection', bikeId)">
    <div class="marker" :class="[pinColor]">
      <div class="icon-wrapper">
        <z-icon class="z-icon" size="3" :color="iconColor">{{ icon }}</z-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZMapMarker',
  props: {
    icon: String,
    iconColor: String,
    pinColor: String,
    bikeId: String,
  },
};
</script>

<style lang="stylus" scoped>
.marker {
    display: inline-block;
    width: 2rem;
    position: relative;
    height: 2rem;
    border-radius: 50% 50% 0% 50%;
    transform: rotate(45deg);
}


.z-icon
  color white

.icon-wrapper
  transform rotate(-45deg);
  margin 3px 16px 16px 3px;
  height: 24px
  width: 24px
  border-radius 50%
  display flex
  align-items center
  justify-content center
</style>

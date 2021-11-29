<template>
  <div class="z-map-popup__bike-service-status">
    <z-tag :color="bikeServiceStatus.color">{{ bikeServiceStatus.label }}</z-tag>
  </div>
</template>

<script>
import { bikeServiceStatuses } from '../../constants';

export default {
  name: 'ZBikeServiceStatus',
  props: {
    serviceStatus: Number,
  },
  computed: {
    bikeServiceStatus() {
      const bikeStatus = bikeServiceStatuses[this.serviceStatus];
      return (
        bikeStatus || {
          label: 'Unknown',
          color: 'neutral',
        }
      );
    },
  },
};
</script>

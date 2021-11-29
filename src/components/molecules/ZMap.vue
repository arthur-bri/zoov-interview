<template>
  <div class="z-map--wrapper">
    <div id="map" v-show="!isNetworkError" />
    <z-container class="z-map--error" v-if="isNetworkError">
      <span>Oops. There was a network error. Please refresh.</span>
      <z-container>
        <z-button @click="fetchBikes">Retry</z-button>
      </z-container>
    </z-container>
  </div>
</template>

<script>
import Vue from 'vue';
import mapboxgl from 'mapbox-gl';
import { mapWritableState } from 'pinia';

import { getCentroid } from '../../utils/map';
import { fetchBikes } from '../../services/bike.service';
import { bikeServiceStatuses } from '../../constants';
import { bikeStore } from '../../store';
import ZMapPopup from './ZMapPopup.vue';
import ZMapMarker from '../atoms/ZMapMarker.vue';

const ZMapPopupClass = Vue.extend(ZMapPopup);
const ZMapMarkerClass = Vue.extend(ZMapMarker);

export default {
  name: 'ZMap',
  data() {
    return {
      isNetworkError: false,
      markers: [],
      map: {},
    };
  },
  async mounted() {
    const { data: bikesData, total, error } = await fetchBikes();
    if (error) {
      this.isNetworkError = true;
      return;
    }

    this.bikes = bikesData;
    this.totalBikes = total;

    // Used to center map between markers, not suited for a lot of markers or distant bikes
    const initialMapPosition = getCentroid(
      bikesData.map((bike) => ({
        x: bike.location.coordinates[0],
        y: bike.location.coordinates[1],
      }))
    );

    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_SECRET_TOKEN;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialMapPosition,
      zoom: 11,
    });

    this.map.on('click', () => {
      this.$nextTick(() => {
        const openedPopups = this.markers.reduce((acc, marker) => {
          const markerPopup = marker.marker.getPopup();
          return markerPopup.isOpen() ? ++acc : acc;
        }, 0);
        if (openedPopups === 0) {
          this.selectedBike = null;
        }
      });
    });

    this.bikes.forEach((bike) => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setLngLat(bike.location.coordinates)
        .setHTML('<div id="vue-popup-content" />')
        .addTo(this.map);

      const popupInstance = new ZMapPopupClass({
        propsData: {
          bike,
        },
      });

      popupInstance.$mount('#vue-popup-content');
      popup._update();

      const markerInstance = new ZMapMarkerClass({
        propsData: {
          icon: 'zoov-bike',
          iconColor: !bike.in_order ? 'danger' : 'white',
          pinColor: bikeServiceStatuses[bike.service_status].color,
          bikeId: bike.id,
        },
      }).$mount();

      popupInstance.$on('manage', () => {
        this.showBikeManager = true;
      });

      const marker = new mapboxgl.Marker(markerInstance.$el).setLngLat(bike.location.coordinates).setPopup(popup).addTo(this.map);
      markerInstance.$on('selection', (bikeId) => {
        this.selectedBike = bikeId;
      });
      this.markers.push({
        id: bike.id,
        marker,
      });
    });

    this.$root.$on('bikeUpdate', (bike) => {
      this.refreshMarker(bike);
    });

    this.$root.$on('bikeDelete', (bike) => {
      this.deleteMarker(bike);
    });

    this.$root.$on('bikesUpdate', () => {
      this.refreshMarkers();
    });
  },
  methods: {
    refreshMarkers() {
      const bikeIds = this.bikes.map((bike) => bike.id);
      this.markers = this.markers.filter((marker) => {
        const toRemove = !bikeIds.includes(marker.id);
        toRemove && marker.marker.remove();
        return !toRemove;
      });

      const markerIds = this.markers.map((marker) => marker.id);
      this.bikes.forEach((bike) => {
        const bikeMarkerExists = markerIds.includes(bike.id);
        if (bikeMarkerExists) return;

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(bike.location.coordinates)
          .setHTML('<div id="vue-popup-content" />')
          .addTo(this.map);

        const popupInstance = new ZMapPopupClass({
          propsData: {
            bike,
          },
        });

        popupInstance.$mount('#vue-popup-content');
        popup._update();

        const markerInstance = new ZMapMarkerClass({
          propsData: {
            icon: 'zoov-bike',
            iconColor: !bike.in_order ? 'danger' : 'white',
            pinColor: bikeServiceStatuses[bike.service_status].color,
            bikeId: bike.id,
          },
        }).$mount();

        popupInstance.$on('manage', () => {
          this.showBikeManager = true;
        });

        const marker = new mapboxgl.Marker(markerInstance.$el).setLngLat(bike.location.coordinates).setPopup(popup).addTo(this.map);
        markerInstance.$on('selection', (bikeId) => {
          this.selectedBike = bikeId;
        });
        this.markers.push({
          id: bike.id,
          marker,
        });
      });
    },
    refreshMarker(updatedBike) {
      this.markers = this.markers.filter((marker) => {
        const toRemove = marker.id === updatedBike.id;
        toRemove && marker.marker.remove();
        return !toRemove;
      });

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setLngLat(updatedBike.location.coordinates)
        .setHTML('<div id="vue-popup-content" />')
        .addTo(this.map);

      const popupInstance = new ZMapPopupClass({
        propsData: {
          bike: updatedBike,
        },
      });

      popupInstance.$mount('#vue-popup-content');
      popup._update();

      popupInstance.$on('manage', (bikeId) => {
        this.selectedBike = bikeId;
        this.showBikeManager = true;
      });

      const markerInstance = new ZMapMarkerClass({
        propsData: {
          icon: 'zoov-bike',
          iconColor: !updatedBike.in_order ? 'danger' : 'white',
          pinColor: bikeServiceStatuses[updatedBike.service_status].color,
          bikeId: updatedBike.id,
        },
      }).$mount();

      const marker = new mapboxgl.Marker(markerInstance.$el)
        .setLngLat(updatedBike.location.coordinates)
        .setPopup(popup)
        .addTo(this.map)
        .togglePopup();

      this.markers.push({
        id: updatedBike.id,
        marker,
      });

      this.bikes = this.bikes.map((bike) => (bike.id === updatedBike.id ? updatedBike : bike));
    },
    deleteMarker(deletedBike) {
      this.markers = this.markers.filter((marker) => {
        const toRemove = marker.id === deletedBike.id;
        toRemove && marker.marker.remove();
        return !toRemove;
      });
    },
  },
  computed: {
    ...mapWritableState(bikeStore, ['selectedBike', 'bikes', 'showBikeManager', 'totalBikes']),
  },
  watch: {
    selectedBike() {
      if (!this.selectedBike) return;

      const currentBikeMarker = this.markers.find((marker) => marker.id === this.selectedBike);

      this.markers.forEach((marker) => {
        const markerPopup = marker.marker.getPopup();
        if (marker.marker === currentBikeMarker && !markerPopup.isOpen()) {
          currentBikeMarker.marker.togglePopup();
        } else if (markerPopup.isOpen()) {
          marker.marker.togglePopup();
        }
      });
      currentBikeMarker.marker.togglePopup();
      this.map.flyTo({
        center: currentBikeMarker.marker._lngLat,
      });
    },
  },
};
</script>

<style lang="stylus">
#map
  height 100%
  width 100%

.z-map
  &--wrapper
    height 100%
    width 100%
    display flex
    flex-direction column
    justify-content center
    align-items center

  &--error
    width auto
    display flex
    flex-direction column

.z-map-popup
  border-radius 12px

.mapboxgl-popup-close-button
  display none

.mapboxgl-popup-content
  padding 0
  border-radius 12px

  > *
    transition none
</style>

<template>
  <div>
    <z-app>
      <z-website-nav
        :cta="{ text: 'hire me', href: 'https://arthur-briere.me', target: '_blank' }"
        :breadcrumb="{ text: 'interview' }"
        fade
      >
      </z-website-nav>
      <div class="zoov-app__frame">
        <z-container class="container neutral--light-5">
          <z-map />
          <div class="bike-list__wrapper neutral--light-4" :class="!showBikeList && 'hidden'">
            <div class="bike-list__wrapper-header">
              <div class="bike-list__wrapper-header-start">
                <div>
                  <div class="bike-list__wrapper-header-title">
                    <z-button icon outline tiny @click="showBikeList = !showBikeList">
                      <z-icon>close</z-icon>
                    </z-button>
                    <h4>Bike list</h4>
                  </div>
                  <h6 v-if="bikes.length === totalBikes">{{ bikes.length }} bikes</h6>
                  <h6 v-else>{{ bikes.length }}/{{ totalBikes }} bikes displayed</h6>
                </div>
                <z-button small @click="showFilters = !showFilters" color="tertiary" :outline="filterQueryString === ''">
                  Filter
                  <z-icon>filter</z-icon>
                </z-button>
              </div>
              <z-filter :showFilters="showFilters" />
              <z-divider class="bike-list__filter-divider" />
            </div>
            <div class="bike-list__wrapper-body">
              <z-bike-list />
            </div>
          </div>
          <div class="bike-list__toggle-button" v-if="!showBikeList">
            <z-button color="secondary" @click="showBikeList = !showBikeList">
              View bikes
              <z-icon>stack</z-icon>
            </z-button>
          </div>
        </z-container>
      </div>
      <z-drawer class="z-bike-manager__wrapper" v-model="showBikeManager" right width="340px">
        <bike-manager />
      </z-drawer>
    </z-app>
  </div>
</template>

<script>
import ZMap from './components/molecules/ZMap.vue';
import ZBikeList from './components/organisms/ZBikeList.vue';
import ZFilter from './components/molecules/ZFilter.vue';
import BikeManager from './components/organisms/ZBikeManager.vue';
import { bikeStore } from './store';
import { mapState, mapWritableState } from 'pinia';

export default {
  name: 'App',
  components: { ZMap, ZBikeList, ZFilter, BikeManager },
  mounted() {
    this.$root.$on('bikeDelete', (deletedBike) => {
      this.bikes = this.bikes.filter((bike) => bike.id !== deletedBike.id);
    });
  },
  data() {
    return {
      showFilters: false,
      showOnlyAvailable: false,
      showBikeList: false,
    };
  },
  computed: {
    ...mapState(bikeStore, ['totalBikes', 'filterQueryString']),
    ...mapWritableState(bikeStore, ['bikes', 'showBikeManager']),
  },
};
</script>

<style lang="stylus">
html
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

.zoov-app__frame
  background white
  background-image linear-gradient(to right, #1ee3cf 0%, #4cadff 100%)
  height 100vh
  padding 140px 60px 20px

  +media-down('xs')
    padding 80px 10px 0


.container
  display flex
  border-radius 10px
  overflow hidden
  height 90%

.bike-list__wrapper
  position absolute
  right 0px
  top 0px
  width 360px
  height 100%
  overflow scroll
  border-radius 12px
  transition transform 200ms ease

  +media-down('md')
    width 100%

  &-header
    position sticky
    top 0
    background inherit
    z-index 2
    display flex
    justify-content space-between
    margin-bottom 10px
    padding 20px 20px 0

  &-body
    margin 20px
    z-index -1

  &.hidden
    transform translateX(100%)

.bike-list__wrapper-header
  display flex
  flex-direction column
  align-items center

.bike-list__wrapper-header-title
  display flex
  align-items center

  > * + *
    padding-left 8px

.bike-list__wrapper-header-start
  display flex
  justify-content space-between
  align-items center
  width 100%

.bike-list__filter-divider
  margin-bottom 0 !important

.z-drawer__content
  padding 20px

.bike-list__toggle-button
  position absolute
  bottom 24px
  right 16px
</style>

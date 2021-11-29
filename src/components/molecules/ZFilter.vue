<template>
  <z-expandable class="bike-list" v-model="showFilters" external>
    <div class="bike-list__filter-wrapper">
      <z-divider />
      <h6>Bike state</h6>
      <z-radio v-model="inOrder" label="All" :input-value="null" />
      <z-radio v-model="inOrder" label="In order" :input-value="true" />
      <z-radio v-model="inOrder" label="Out of service" :input-value="false" />
    </div>
  </z-expandable>
</template>

<script>
import { bikeStore } from '../../store';
import { mapWritableState } from 'pinia';
import { fetchBikes } from '../../services/bike.service';

export default {
  name: 'ZFilter',
  props: {
    showFilters: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inOrder: null,
      queryString: {
        in_order: null,
      },
    };
  },
  mounted() {
    this.$root.$on('bikeUpdate', () => {
      this.applyFilters();
    });
  },
  computed: {
    ...mapWritableState(bikeStore, ['bikes', 'totalBikes', 'filterQueryString']),
    fullQueryString() {
      const queryStringArgs = Object.keys(this.queryString).map((item) => {
        return this.queryString[item] !== null ? `${item}=${this.queryString[item]}` : '';
      });
      return queryStringArgs[0] !== '' ? `?${queryStringArgs[0]}` : '';
    },
  },
  watch: {
    async inOrder() {
      this.queryString.in_order = this.inOrder;
      this.applyFilters();
    },
    fullQueryString() {
      this.filterQueryString = this.fullQueryString;
    },
  },
  methods: {
    async applyFilters() {
      const { data: bikesData, error } = await fetchBikes(this.fullQueryString);
      if (error) {
        this.isNetworkError = true;
        return;
      }

      this.bikes = bikesData;
      this.$root.$emit('bikesUpdate');
    },
  },
};
</script>

<style lang="stylus">
.bike-list
  width 100%
  margin-bottom 16px

.bike-list__filter-wrapper
  > *
    margin size(0.5) size(1) size(0.5) 0
</style>

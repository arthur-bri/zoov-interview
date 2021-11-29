<template>
  <z-container class="z-bike-manager">
    <div class="z-bike-manager__header-title">
      <z-button icon outline tiny @click="showBikeManager = !showBikeManager">
        <z-icon>close</z-icon>
      </z-button>
      <h4>Manage a bike</h4>
    </div>
    <span>{{ bike.serial_number }}</span>
    <z-form>
      <z-select v-model="serviceStatus" :options="bikeStatusesOptions" label="Bike status" />
      <h6>Battery level</h6>
      <z-input
        class="z-bike-manager__input"
        type="number"
        v-model="batteryLevel"
        :error="!isValidBatteryLevel"
        :message="!isValidBatteryLevel ? 'The battery percentage have to be between 0 and 100' : ''"
      />
      <h6>In service</h6>
      <z-checkbox v-model="inOrder" label="In service" />
    </z-form>
    <z-container class="z-bike-manager--save">
      <z-button :disabled="!isFormValid" @click="saveChanges">Save</z-button>
      <span v-if="showSuccess" class="text--success">Update succeed !</span>
      <span v-else-if="showError" class="text--danger">Update failed. Please try again.</span>
    </z-container>
    <z-container class="z-bike-manager--danger-zone">
      <z-dialog v-model="isDangerZoneVisible">
        <template v-slot:activator="{ activate }">
          <z-button color="danger" @click="activate" small>Danger zone</z-button>
        </template>
        <div>
          <h4>Delete this bike ?</h4>
          <z-divider />
          <div class="z-bike-manager--buttons">
            <z-button color="danger" small @click="deleteBike">Yes</z-button>
            <z-button color="info" small @click="toggleDangerZone">Cancel</z-button>
          </div>
        </div>
      </z-dialog>
    </z-container>
  </z-container>
</template>

<script scoped>
import { fetchBike, updateBike, deleteBike } from '../../services/bike.service';
import { bikeServiceStatuses } from '../../constants';
import { bikeStore } from '../../store';
import { mapWritableState } from 'pinia';

export default {
  name: 'ZBikeManager',

  data() {
    return {
      serviceStatus: '',
      inOrder: true,
      batteryLevel: '0',
      bike: {},
      showSuccess: false,
      showError: false,
      isDangerZoneVisible: false,
    };
  },
  watch: {
    async selectedBike() {
      if (!this.selectedBike) return;

      const { data: bike, error } = await fetchBike(this.selectedBike);

      if (!error) {
        this.bike = bike;
      }

      this.serviceStatus = bikeServiceStatuses[bike.service_status].label;
      this.inOrder = bike.in_order;
      this.batteryLevel = bike.battery_level.toString();
    },
  },
  computed: {
    ...mapWritableState(bikeStore, ['selectedBike', 'showBikeManager', 'totalBikes']),
    bikeStatusesOptions() {
      return Object.values(bikeServiceStatuses).map((status) => status.label);
    },
    isValidBatteryLevel() {
      return Number(this.batteryLevel) > -1 && Number(this.batteryLevel) < 101;
    },
    isFormValid() {
      return this.isValidBatteryLevel;
    },
  },
  methods: {
    async saveChanges() {
      if (!this.isFormValid) return;

      const serviceStatusCode = Object.keys(bikeServiceStatuses).find(
        (statusCode) => bikeServiceStatuses[statusCode].label === this.serviceStatus
      );
      const payload = {
        service_status: Number(serviceStatusCode),
        in_order: this.inOrder,
        battery_level: Number(this.batteryLevel),
      };

      const { data: updatedBike, error } = await updateBike(this.bike.id, payload);
      if (!error) {
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
        }, 2000);
      } else {
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 2000);
      }
      this.$root.$emit('bikeUpdate', updatedBike);
    },
    toggleDangerZone() {
      this.isDangerZoneVisible = !this.isDangerZoneVisible;
    },
    async deleteBike() {
      const { data: deletedBike } = await deleteBike(this.bike.id);
      this.$root.$emit('bikeDelete', deletedBike);
      this.showBikeManager = false;

      this.isDangerZoneVisible = false;
      this.selectedBike = null;
      this.totalBikes--;
    },
  },
};
</script>

<style scoped lang="stylus">
.z-bike-manager
  display flex
  flex-direction column
  align-items flex-start

.z-bike-manager__header-title
  display flex
  align-items center

  > * + *
    padding-left 8px

.z-bike-manager--save
  display flex
  flex-direction column
  align-items baseline

  > span
    position absolute
    top 100%

.z-bike-manager--danger-zone
  padding-top 20px
  text-align right

.z-bike-manager--buttons
  > button + button
    margin-left 8px

.z-bike-manager__input
  margin-bottom 12px
</style>

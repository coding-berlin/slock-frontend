<template>
  <MglMap
    :accessToken="accessToken"
    :zoom="12"
    :center="center"
    :mapStyle.sync="mapStyle"
    style="height:80vh;"
    @load="mapLoaded"
  >
    <MglNavigationControl position="top-right"/>
    <MglMarker v-if="geoposition" :coordinates="geoposition" color="blue">
      <v-icon slot="marker">location_on</v-icon>
    </MglMarker>
    <MglMarker
      v-if="showOtherLocations"
      v-for="location in otherLocations"
      :key="location.id"
      :coordinates="[location.longitude, location.latitude]"
      @click="$emit('otherLocationSelected', location)"
    >
      <div
        :style="{ width: 30 + 'px', height: 30 + 'px', backgroundSize: 50+'px', backgroundImage: `url(${img.imgBuilding})`}"
        slot="marker"
      ></div>
    </MglMarker>
    <MglMarker
      v-for="loc in userLocations"
      :key="loc.id"
      :coordinates="[loc.location.longitude, loc.location.latitude]"
      color="red"
    >
      <div
        :style="{ width: 50 + 'px', height: 50 + 'px', backgroundSize: 50+'px', backgroundImage: `url(${img.imgBuilding})`}"
        slot="marker"
      ></div>
    </MglMarker>
    <MglMarker
      v-for="booking in bookings"
      :key="booking.id"
      :offset="[40,10]"
      :coordinates="[booking.slot.location.longitude, booking.slot.location.latitude]"
      @click="$emit('bookingSelected', booking)"
    >
      <div
        :style="{ width: 40 + 'px', height: 40 + 'px', backgroundSize: 40+'px', backgroundImage: `url(${img.imgTruck})`}"
        slot="marker"
      ></div>
    </MglMarker>

    <v-btn fab dark small color="pink" @click.stop="getGeoposition">
      <v-icon dark>explore</v-icon>
    </v-btn>
  </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker, MglNavigationControl } from "vue-mapbox";

import imgTruck from "../assets/foodtruck.png";
import imgBuilding from "../assets/building.png";
export default {
  components: {
    MglMap,
    MglMarker,

    MglNavigationControl
  },
  props: {
    allLocations: Array,
    userLocations: Array,
    selectedLocation: Object,
    bookings: Array
  },
  data() {
    return {
      img: { imgTruck, imgBuilding },
      geoposition: null,
      center: [13, 52],
      mapStyle: process.env.VUE_APP_MAPBOX_MAP_STYLE,
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN
    };
  },
  async created() {
    this.mapbox = Mapbox; // We need to set mapbox-gl library here in order to use it in template
  },

  computed: {
    otherLocations() {
      if (!this.allLocations || !this.userLocations) {
        return [];
      }

      return this.allLocations.filter(
        loc1 => !this.userLocations.some(loc2 => (
          loc2.location.id === loc1.id ||
          (loc2.location.latitude === loc1.latitude &&
           loc2.location.longitude === loc1.longitude)
        ))
      );
    },
    showOtherLocations() {
      return this.allLocations && this.$store.state.showLocations;
    }
  },
  methods: {
    async mapLoaded(event) {
      this.asyncActions = event.component.actions;
    },
    getGeoposition() {
      navigator.geolocation.getCurrentPosition(position => {
        this.geoposition = [
          position.coords.longitude,
          position.coords.latitude
        ];
        this.center = this.geoposition;
        this.$emit("locationChange", {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      });
    }
  },
  watch: {
    selectedLocation: function(newVal, oldVal) {
      this.asyncActions.flyTo({
        center: [newVal.location.longitude, newVal.location.latitude],
        //zoom: 9,
        speed: 1
      });
      console.log(oldVal);
    }
  }
};
</script>

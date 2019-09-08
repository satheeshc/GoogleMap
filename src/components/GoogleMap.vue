<template>
  <div>
    <div>
      <h2>Search and add a pin</h2>
      <label>
        <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
        <button @click="addMarker">Add</button>
      </label>
      <br>
    </div>
    <br>
    <gmap-map :center="center" :zoom="8" style="width:100%;  height: 500px;">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="toggleInfoWindow(m,index)"
      >></gmap-marker>

      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen=false"
      >
        <div v-html="infoContent"></div>
      </gmap-info-window>
    </gmap-map>
  </div>
</template>

<script>
import axios from "axios";
import json from "@/data/svc.json";

export default {
  name: "GoogleMap",
  data() {
    return {
      // default to montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 27.6648, lng: -81.5158 },
      markers: [],

      serviceCenters: [],
      places: [],
      currentPlace: null,
      map: null,
      infoContent: "",
      zoom: 15,
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 1,
          height: -35
        }
      }
    };
  },

  mounted() {
    this.geolocate();
  },

  methods: {
    setPlace(place) {
      this.currentPlace = place;
    },
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.position;

      this.infoContent = this.getInfoWindowContent(this.serviceCenters[idx]);

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },

    getInfoWindowContent: function(marker) {
      return `<div class="card">
        <div class="card-content">
        <p><b> ${marker.name} Service Center</b><br> </p>
	      <p class="infwind-addrs"> ${marker.address_line1}  
			<br> ${marker.address_city}, FL - ${marker.address_zip} 
			<br> ${marker.phone1.value}<br> ${marker.phone2.value}</p>
			Open 7:30 AM to 4:30 PM<p></p><br>
	    <button href='#'>Email Us</button>
	     </div>
    </div>`;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        console.log(json.data);
        this.serviceCenters = json.data;
        this.serviceCenters.forEach(coord => {
          console.log(coord.coordinates);
          const marker = {
            lat: coord.coordinates.lat,
            lng: coord.coordinates.lon
          };
          this.markers.push({ position: marker });
        });

        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    getSvcInfo: function() {
      axios
        .get(
          "http://localhost:9080/builder-api/public/serviceCenter?lon=-80.38724179999997&lat=26.0645825&addressType=premise&city=Weston&zipCode=33331&sourceSystem=EXTERNAL&_=1567824135124"
        )
        .then(response => (this.info = response));
      console.log("*******************" + this.info);
    }
  }
};
</script>

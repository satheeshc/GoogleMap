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

export default {
  name: "GoogleMap",
  data() {
    return {
      // default to montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 27.6648, lng: -81.5158 },
      markers: [],

      markerCoordinates: [
        {
          latitude: 26.1506566,
          longitude: -80.1856583
        },
        {
          latitude: 26.042454,
          longitude: -80.232849
        }
      ],
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
      this.infoContent = this.getInfoWindowContent(marker);

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
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
        <div class="media">
          <div class="media-content">
            <p class="title is-4">${marker.name}</p>
          </div>
        </div>
        <div class="content">
          ${marker.description}
          <br>
          <time datetime="2016-1-1">${marker.date_build}</time>
        </div>
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
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
        this.markerCoordinates.forEach(coord => {
          const marker = {
            lat: coord.latitude,
            lng: coord.longitude
          };
          this.markers.push({ position: marker });
          this.places.push(this.currentPlace);
          this.center = marker;
          this.currentPlace = null;
        });

        // this.markerCoordinates.forEach(coord => {
        //   const position = new google.maps.LatLng(
        //     coord.latitude,
        //     coord.longitude
        //   );
        //   const marker = new google.maps.Marker({
        //     position,
        //     map
        //   });
        //   //  this.getSvcInfo();
        //   this.markers.push({ position: marker });
        //   this.places.push(this.currentPlace);
        //   this.center = marker;
        //   this.currentPlace = null;
        // });
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

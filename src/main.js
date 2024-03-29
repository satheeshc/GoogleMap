// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAucPXYgiPQJAw5zQuIlP30OFXIrgwOhAQ",
    libraries: "places" //necessary for places input
  }
});

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});

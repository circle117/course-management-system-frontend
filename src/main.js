// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import VueCookies from 'vue-cookies'
import 'element-ui/lib/theme-chalk/index.css'
import router from "./router";
import axios from "axios";

Vue.prototype.$axios = axios
Vue.config.productionTip = false
axios.defaults.baseURL = "http://localhost:5000/"
axios.defaults.withCredentials = true

Vue.use(ElementUI)
Vue.use(VueCookies)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  router
})

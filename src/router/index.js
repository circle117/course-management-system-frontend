import Vue from 'vue'
import Router from 'vue-router'
// import App from "@/App";
import App from "../App";
import SelectCourse from "../page/SelectCourse"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
      path: '/selectCourse',
      name: 'SelectCourse',
      component: SelectCourse
    }
  ],
  mode: 'history'
})

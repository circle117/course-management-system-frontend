import Vue from 'vue'
import Router from 'vue-router'
import App from "../App";
import SelectCourse from "../page/SelectCourse"
import AdministratorManage from "../page/AdministratorManage"
import TeacherManage from "../page/TeacherManage"

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
    },
    {
      path: '/manage',
      name: 'AdministratorManage',
      component: AdministratorManage
    },
    {
      path: '/TeacherManage',
      name: 'TeacherManage',
      component: TeacherManage
    }
  ],
  mode: 'history'
})

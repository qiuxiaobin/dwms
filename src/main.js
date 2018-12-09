import Vue from "vue";
import App from "./App.vue";
import Router from "vue-router";
import Login from "@/components/Login";
import AntDesignVue from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import MenuView from "@/components/MenuView";
import axios from "axios";

Vue.config.productionTip = false;

Vue.use(Router);
Vue.use(AntDesignVue);
Vue.prototype.$axios = axios;

const routes = [
  {
    path: "/login",
    name: "登录页",
    component: Login
  },
  {
    path: "/",
    name: "首页",
    component: MenuView,
    // children: [
    //   {
    //     path: '/system-index',
    //     name: '系统首页',
    //     component: SystemIndex
    //   },
    //   {
    //     path: '/system-index',
    //     name: '系统首页',
    //     component: SystemIndex
    //   },
    //   {
    //     path: '/system-index',
    //     name: '系统首页',
    //     component: SystemIndex
    //   },
    // ]
  }
];

const router = new Router({
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

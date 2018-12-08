import Vue from "vue";
import App from "./App.vue";
import Router from "vue-router";
import Login from "@/components/Login";
import AntDesignVue from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import MenuView from "@/components/MenuView";

Vue.config.productionTip = false;

Vue.use(Router);
Vue.use(AntDesignVue);

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
    props: {
      itemList: [
        { key: "1", icon: "arrow-left", text: "关闭左侧" },
        { key: "2", icon: "arrow-right", text: "关闭右侧" },
        { key: "3", icon: "close", text: "关闭其它" }
      ],
      visible: true
    }
  }
];

const router = new Router({
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

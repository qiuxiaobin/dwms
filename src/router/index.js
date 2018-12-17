import Router from "vue-router";
import Vue from "vue";
import MenuView from "@components/MenuView";
import Page1 from "@components/Page1";
import Page2 from "@components/Page2";
import Page3 from "@components/Page3";
import Workspace from "@components/Workspace";
import Login from "@components/Login";

Vue.use(Router);

const routes = [
  {
    path: "/login",
    // component: () => import("@components/Login")
    component: Login
  },
  {
    path: "*",
    redirect: "/workspace"
  },
  {
    path: "/",
    component: MenuView,
    redirect: "/workspace",
    props: route => ({ field: route.params.field || route.name }),
    children: [
      {
        path: "/workspace",
        name: "workspace",
        component: Workspace
      },
      {
        path: "/report/:field",
        component: Page1,
        // component: () => import("@components/Page1"),
        props: true
      },
      {
        path: "/report/:field/:type/:year/:id",
        component: Page2,
        // component: () => import("@components/Page2"),
        props: true
      },
      {
        path: "/analysis/:field",
        component: Page1,
        // component: () => import("@components/Page1"),
        props: true
      },
      {
        path: "/analysis/:field/:type/:year/:id",
        component: Page2,
        // component: () => import("@components/Page2"),
        props: true
      },
      {
        path: "/analysis/:field/:type/:year/:id/:companyId",
        component: Page3,
        // component: () => import("@components/Page3"),
        props: true
      }
    ]
  }
];

export default new Router({
  routes
});

import Vue from 'vue';
import Router from "vue-router";
import LoginPage from "./components/page-components/LoginPage.vue";
import UserDetails from "./components/page-components/UserDetails.vue";
import UserRoles from "./components/page-components/UserRoles.vue";
Vue.use(Router);


const routes = [
    {
        path: "/users",
        component: UserDetails,
    },
    {
        path: "/",
        component: LoginPage,
    },
    {
      path: "/roles",
      component: UserRoles,
  }
]

const router = new Router(
    {
        mode: "hash",
        routes
    }
);

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
  
    if (!token && to.path !== "/") {
      next("/");
    } else if (to.path === "/" && token) {
      next("/users");
    } else {
      next();
    }
  });
  

export default router;

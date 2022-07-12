import {
  createRouter,
  // createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import layout from "../views/layout.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  // {
  //   path: "/",
  //   redirect: "/project",
  // },
  {
    path: "/home",
    name: "home",
    component: layout,
    children: [
      {
        path: "/home",
        name: "home",
        component: HomeView,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login.vue"),
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/aceeditor",
    name: "",
    component: layout,
    children: [
      {
        path: "/aceeditor",
        name: "aceeditor",
        component: () =>
          import(/* webpackChunkName: "aceeditor" */ "../views/AceEditor.vue"),
      },
    ],
  },
  {
    path: "/project",
    name: "",
    component: layout,
    children: [
      {
        path: "/project",
        name: "project",
        component: () =>
          import(
            /* webpackChunkName: "project" */ "../views/project/Project.vue"
          ),
      },
    ],
  },
  {
    path: "/addproject",
    name: "",
    component: layout,
    children: [
      {
        path: "/addproject",
        name: "addproject",
        component: () =>
          import(
            /* webpackChunkName: "addproject" */ "../views/project/AddProject.vue"
          ),
      },
    ],
  },
  {
    path: "/apilist",
    name: "",
    component: layout,
    children: [
      {
        path: "/apilist",
        name: "apilist",
        component: () =>
          import(
            /* webpackChunkName: "apilist" */ "../views/projectApi/ApiList.vue"
          ),
      },
    ],
  },
  {
    path: "/addapi",
    name: "",
    component: layout,
    children: [
      {
        path: "/addapi",
        name: "addapi",
        component: () =>
          import(
            /* webpackChunkName: "addapi" */ "../views/projectApi/AddApi.vue"
          ),
      },
    ],
  },
  {
    path: "/conditioneditor",
    name: "",
    component: layout,
    children: [
      {
        path: "/conditioneditor",
        name: "conditioneditor",
        component: () =>
          import(
            /* webpackChunkName: "conditioneditor" */ "../views/condition/ConditionEditor.vue"
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // console.log("process.env.BASE_URL", process.env.BASE_URL); // BASE_URL：/
  // 返回 false 以取消导航
  // 开发阶段节省时间 暂时将登录去掉
  const hasToken = sessionStorage.getItem("token");
  if (!hasToken) {
    if (to.path !== "/login") {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
  return true;
});

export default router;

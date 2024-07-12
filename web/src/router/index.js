import { createRouter, createWebHistory } from "vue-router";
import PKIndexView from "@/views/pk/PKIndexView";
import RecordIndexView from "@/views/record/RecordIndexView";
import RanklistIndexView from "@/views/ranklist/RanklistIndexView";
import MyBotsIndexView from "@/views/user/mybots/MyBotsIndexView";
import NotFoundView from "@/views/errors/NotFoundView";
import UserAccountLoginView from "@/views/user/account/UserAccountLoginView";
import UserAccountRegisterView from "@/views/user/account/UserAccountRegisterView";
import store from "@/store/index";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/pk/",  // 如果是根路径则重定向到对战页面
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/pk/",
    name: "pk_index",
    component: PKIndexView,
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/record/",
    name: "record_index",
    component: RecordIndexView,
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/ranklist/",
    name: "ranklist_index",
    component: RanklistIndexView,
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/user/mybots/",
    name: "user_mybots_index",
    component: MyBotsIndexView,
    meta: {
      requestAuth: true,
    },
  },
  {
    path: "/user/account/login/",
    name: "user_account_login",
    component: UserAccountLoginView,
    meta: {
      requestAuth: false,
    },
  },
  {
    path: "/user/account/register/",
    name: "user_account_register",
    component: UserAccountRegisterView,
    meta: {
      requestAuth: false,
    },
  },
  {
    path: "/404/",
    name: "404",
    component: NotFoundView,
    meta: {
      requestAuth: false,
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "others",
    redirect: "/404/",  // 如果不是以上路径之一说明不合法，重定向到404页面
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requestAuth && !store.state.user.is_login) {
    alert("Please login!");
    next({ name: "user_account_login" });
  } else {
    next();  // 如果不需要授权就直接跳转即可
  }
});

export default router;
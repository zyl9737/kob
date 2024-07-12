<template>
  <NavBar/>
  <router-view/>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"
import $ from "jquery";

export default {
  components: {
    NavBar,
  },
  setup() {   // 为组件提供响应式数据和函数
    $.ajax({
      url: "http://localhost:3000/user/account/login/", // 发送POST请求到这
      type: "POST",
      data: {
        username: "zyl",
        password: "pzyl",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      },
    });

    $.ajax({
      url: "http://localhost:3000/user/account/info/",
      type: "GET",
      headers: {
        // 不是固定的，是官方推荐的写法，Authorization是在我们的后端JwtAuthenticationTokenFilter类中设置的
        Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyODcxMTA3N2E2YTE0ZTUxODdkYmYxMGU3MmJkYjFlNCIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTcyMDYwMzgwNiwiZXhwIjoxNzIxODEzNDA2fQ.ccqPsjVTPyW1vafa5TY73Zw6Z1MpaEBbAGAkxJffFns",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      },
    });

    $.ajax({
      url: "http://localhost:3000/user/account/register/",
      type: "POST",
      data: {
        username: "user3",
        password: "123",
        confirmedPassword: "123",
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      },
    });
  },
};
</script>

<style>
body {
  background-image: url("@/assets/images/background.png");
  background-size: cover;
}
</style>

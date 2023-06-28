<template>
  <div v-if="isLoading">
<!--    <div class="dots-loader">-->
<!--    </div>-->
    <p class="absolute top-1/3 left-1/2 transform -translate-x-1/2">Loading, please wait ..</p>
  </div>
  <div v-else class="w-full">
    <component :is="layout"></component>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import { RouterLink, RouterView, useRoute, useRouter} from 'vue-router';
import {useAuthStore} from "@/stores/auth";
import {useApiStore} from "@/stores/api";
import type {UserData} from "@/types/user";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const isLoading = ref(true);
const api = useApiStore();

const layout = computed(() => {
  return route.meta.layout || "LayoutLoggedIn";
});

const routeName = computed(() => {
  return route.name;
});

const routeFullPath = computed(() => {
  return route.fullPath;
});

const routePath = computed(() => {
  return route.path;
});

const routeQuery = computed(() => {
  return route.query;
});

router.isReady().then(() => {
  if(
      routeName.value !== "callback" && routeName.value !== "login" && routeName.value !== "callback-user"
  )
  {
    api.axiosAuth.get("/user")
        .then(async (response) => {
          authStore.isLoggedIn = true;
          authStore.setUser(response.data as UserData)
          if(routeName.value === "login")
          {
            await router.push({name: "home"});
          }
          isLoading.value = false;

        })
        .catch(async () => {
          if(typeof routeName.value !== "string")
          {
            console.log("bad route");
            console.log("route name: ", routeName.value);
            console.log("window location: ", window.location.href);
            console.log("route raw name: ", route.fullPath);
            console.log("route fullPath: ", routeFullPath.value);
            console.log("route path: ", routePath.value);
            console.log("route query: ", routeQuery.value);
            return;
          }

          authStore.isLoggedIn = false
          if(!["login", "callback"].includes(routeName.value))
          {
            await router.push({name: "login"});
          }

          isLoading.value = false;
        })
  }
  else
  {
    isLoading.value = false;
  }
})


authStore.initApp();


</script>

<!--<style scoped>-->
<!--header {-->
<!--  line-height: 1.5;-->
<!--  max-height: 100vh;-->
<!--}-->

<!--.logo {-->
<!--  display: block;-->
<!--  margin: 0 auto 2rem;-->
<!--}-->

<!--nav {-->
<!--  width: 100%;-->
<!--  font-size: 12px;-->
<!--  text-align: center;-->
<!--  margin-top: 2rem;-->
<!--}-->

<!--nav a.router-link-exact-active {-->
<!--  color: var(&#45;&#45;color-text);-->
<!--}-->

<!--nav a.router-link-exact-active:hover {-->
<!--  background-color: transparent;-->
<!--}-->

<!--nav a {-->
<!--  display: inline-block;-->
<!--  padding: 0 1rem;-->
<!--  border-left: 1px solid var(&#45;&#45;color-border);-->
<!--}-->

<!--nav a:first-of-type {-->
<!--  border: 0;-->
<!--}-->

<!--@media (min-width: 1024px) {-->
<!--  header {-->
<!--    display: flex;-->
<!--    place-items: center;-->
<!--    padding-right: calc(var(&#45;&#45;section-gap) / 2);-->
<!--  }-->

<!--  .logo {-->
<!--    margin: 0 2rem 0 0;-->
<!--  }-->

<!--  header .wrapper {-->
<!--    display: flex;-->
<!--    place-items: flex-start;-->
<!--    flex-wrap: wrap;-->
<!--  }-->

<!--  nav {-->
<!--    text-align: left;-->
<!--    margin-left: -1rem;-->
<!--    font-size: 1rem;-->

<!--    padding: 1rem 0;-->
<!--    margin-top: 1rem;-->
<!--  }-->
<!--}-->
<!--</style>-->

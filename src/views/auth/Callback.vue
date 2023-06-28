<template>
  <div>
    <p class="absolute top-1/3 left-1/2 transform -translate-x-1/2">Please wait while logging you in...</p>
<!--    <div class="dots-loader"></div>-->
  </div>

</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {useApiStore} from "@/stores/api";

const authStore = useAuthStore();
const api = useApiStore();
const route = useRoute();
const router = useRouter();

api.axiosAuth.get(`/callback`, {params: route.query})
    .then(async (response) => {
      authStore.loginUser(response.data);
      window.location.href = router.resolve({name: 'home'}).href;
    })
    .catch((err) => {
      if(err.response.data.err_code===100){
        router.push({name: 'login-error'})
      }
    });


</script>

<!--<style scoped>-->
<!--.dots-loader:not(:required) {-->
<!--  opacity: 1;-->
<!--  overflow: hidden;-->
<!--  position: absolute;-->
<!--  left: 50%;-->
<!--  top: 50%;-->
<!--  margin-left: -4px;-->
<!--  margin-top: -4px;-->
<!--  text-indent: -9999px;-->
<!--  display: inline-block;-->
<!--  width: 8px;-->
<!--  height: 8px;-->
<!--  background: transparent;-->
<!--  border-radius: 100%;-->
<!--  box-shadow: #f86 -14px -14px 0 7px, #fc6 14px -14px 0 7px,-->
<!--  #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;-->
<!--  animation: dots-loader 5s infinite ease-in-out;-->
<!--  transform-origin: 50% 50%;-->
<!--  transform: scale(1);-->
<!--  transition: 0.3s all;-->
<!--}-->

<!--@keyframes dots-loader {-->
<!--  0% {-->
<!--    box-shadow: #f86 -14px -14px 0 7px, #fc6 14px -14px 0 7px,-->
<!--    #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;-->
<!--  }-->
<!--  8.33% {-->
<!--    box-shadow: #f86 14px -14px 0 7px, #fc6 14px -14px 0 7px,-->
<!--    #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;-->
<!--  }-->
<!--  16.67% {-->
<!--    box-shadow: #f86 14px 14px 0 7px, #fc6 14px 14px 0 7px, #6d7 14px 14px 0 7px,-->
<!--    #4ae -14px 14px 0 7px;-->
<!--  }-->
<!--  25% {-->
<!--    box-shadow: #f86 -14px 14px 0 7px, #fc6 -14px 14px 0 7px,-->
<!--    #6d7 -14px 14px 0 7px, #4ae -14px 14px 0 7px;-->
<!--  }-->
<!--  33.33% {-->
<!--    box-shadow: #f86 -14px -14px 0 7px, #fc6 -14px 14px 0 7px,-->
<!--    #6d7 -14px -14px 0 7px, #4ae -14px -14px 0 7px;-->
<!--  }-->
<!--  41.67% {-->
<!--    box-shadow: #f86 14px -14px 0 7px, #fc6 -14px 14px 0 7px,-->
<!--    #6d7 -14px -14px 0 7px, #4ae 14px -14px 0 7px;-->
<!--  }-->
<!--  50% {-->
<!--    box-shadow: #f86 14px 14px 0 7px, #fc6 -14px 14px 0 7px,-->
<!--    #6d7 -14px -14px 0 7px, #4ae 14px -14px 0 7px;-->
<!--  }-->
<!--  58.33% {-->
<!--    box-shadow: #f86 -14px 14px 0 7px, #fc6 -14px 14px 0 7px,-->
<!--    #6d7 -14px -14px 0 7px, #4ae 14px -14px 0 7px;-->
<!--  }-->
<!--  66.67% {-->
<!--    box-shadow: #f86 -14px -14px 0 7px, #fc6 -14px -14px 0 7px,-->
<!--    #6d7 -14px -14px 0 7px, #4ae 14px -14px 0 7px;-->
<!--  }-->
<!--  75% {-->
<!--    box-shadow: #f86 14px -14px 0 7px, #fc6 14px -14px 0 7px,-->
<!--    #6d7 14px -14px 0 7px, #4ae 14px -14px 0 7px;-->
<!--  }-->
<!--  83.33% {-->
<!--    box-shadow: #f86 14px 14px 0 7px, #fc6 14px -14px 0 7px,-->
<!--    #6d7 14px 14px 0 7px, #4ae 14px 14px 0 7px;-->
<!--  }-->
<!--  91.67% {-->
<!--    box-shadow: #f86 -14px 14px 0 7px, #fc6 14px -14px 0 7px,-->
<!--    #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;-->
<!--  }-->
<!--  100% {-->
<!--    box-shadow: #f86 -14px -14px 0 7px, #fc6 14px -14px 0 7px,-->
<!--    #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;-->
<!--  }-->
<!--}-->

<!--.loaded .dots-loader {-->
<!--  opacity: 0;-->
<!--  z-index: -1;-->
<!--  pointer-events: none;-->
<!--  transform: scale(0);-->
<!--}-->

<!--</style>-->


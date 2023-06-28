<template>
  <div class="image-container">
    <img src="@/assets/img/dashboard.jpg" alt="Image">
  </div>
  <div>
    <span class="flex justify-center text-2xl">Welcome to ServTool!</span>
    <div class="max-w-screen-lg mx-auto">
    <p class="text-center mt-5">Let ServTool manage your tasks and make your work easier!
      Add the domains and servers in your care and let us do our magic!</p>
    <br>
    <p class="text-center">
      Make sure to add the desired checks for your domains and servers before looking for results.
      You can do that from the
      <RouterLink to="/domains"> Domains </RouterLink> / <RouterLink to="/servers"> Servers </RouterLink>
      pages, along with adding end deleting certain entities.
    </p>
    <p class="text-center mt-2">
      In need of better organization? Make use of our <RouterLink to="/taasks"> Tasks </RouterLink> page to create recurring tasks. The active ones will automatically ring the bell.
    </p>
    <p class="text-center mt-2">
      All settled? Look out for the bell! Our checks are made every 5 minutes so be ready for notifications any time soon!
      Regardless of the check status, every entrance is dated in our
      <RouterLink to="/results"> Results </RouterLink> page.
      You can list/graph and filter your results to have a better image of what you're working with.
      Everytime our checks encounter an error, we'll notify you by email and ring the bell. For more details, check our
      <RouterLink to="/notifications"> Notifications </RouterLink>
      page. You'll also find there the active tasks.
    </p>
    <p class="text-center font-bold my-3">
      Happy monitoring!
    </p>
    <p class="text-center mt-10">
      <B>Have some questions?</b> Feel free to ask us anytime at: <a class="underline" href="mailto:contact@servtool.org">contact@servtool.org </a>.
    </p>
    </div>

  </div>
<!--  <div>-->
<!--    <img src="@/assets/img/dashboard.jpg">-->
<!--  </div>-->
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useAuthStore} from "@/stores/auth";
import {useApiStore} from "@/stores/api";

const authStore = useAuthStore();
const apiStore = useApiStore();

import {User} from "@/types/user.ts";
import router from "@/router";

const user=ref<User|null>(new User);
user.value=authStore.user;
const logout = () => {
  // if (authStore.$id !== "auth") {
    authStore.logoutUser();
  // }
  window.location.href = router.resolve({name: 'login'}).href;
}

</script>

<style>
.image-container {
  position: relative;
  width: 600px; /* Set the desired width */
  height: 400px; /* Set the desired height */
  margin:auto;

}

</style>
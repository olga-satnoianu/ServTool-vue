<template>
  <nav class="w-full bg-white fixed top-0 z-[9999999] rounded-lg border-b border-gray-200">
    <div class="flex justify-between mx-auto w-full max-w-full px-8">
      <div class="flex justify-center py-6">
        <div class="flex space-x-4 items-center">
          <div class="flex items-center space-x-4 w-full">
            <RouterLink to="/">
              <img class="w-48" src="@/assets/img/servtool_icon.jpg">
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex items-center space-x-8">
          <div class="relative cursor-pointer">
            <div @mouseover="bellanimation = true" @mouseleave="bellanimation = false"
                 :class="bellanimation === true ? ' alert' : ''"
                 class="notification h-[35px] w-[35px] rounded-full hover:border-accent">
              <div
                  class="notification__badge text-[11px] text-white flex justify-center items-center p-2 font-bold relative z-10 left-6 bg-blue-500 rounded-full">
                <span>{{ notificationStore.countNotifications() }}</span>
              </div>
              <div class="notification__bell absolute bg-blue-500 w-3 h-3 left-0 right-0 block"></div>
            </div>
          </div>
          <div id="dropdown" @click="clickedmenu = !clickedmenu" class="flex space-x-3 relative">
            <div class="flex items-center">
              <p class="pr-3 font-medium text-blue-400">Welcome, <span>{{ authStore.user.getFullName() }}</span></p>
            </div>
            <img
                :class="clickedmenu === true ? ' rotate-0 transition duration-150 ease-out' : 'rotate-180 transition duration-150 ease-out'"
                src="../assets/img/down_arrow.svg" class="cursor-pointer pointer-events-none">
            <Transition name="slide-fade">
              <div v-if="clickedmenu"
                   class="absolute bg-white z-10 top-16 min-w-[240px] shadow-lg py-4 px-6 rounded-md flex-col flex justify-start -right-8 space-y-3">
                <div class="flex space-x-3 items-center justify-center">
                  <span class="contents text-blue-500 text-center block text-sm font-semibold">{{ authStore.user.getInitials() }}</span>
                </div>
                <div class="hover:bg-blue-100">
                  <RouterLink to="/">Home</RouterLink>
                </div>
                <div class="border-t border-b-gray-300 pt-3 hover:bg-blue-100" @click="Logout">
                  <a class="cursor-pointer">Logout</a>
                </div>
              </div>
            </Transition>
          </div>

        </div>
      </div>
    </div>
  </nav>
</template>


<script setup lang="ts">

import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
import { useAuthStore } from "@/stores/auth";
import { useCookies } from "vue3-cookies";
import { useNotificationStore } from "@/stores/ notifications";
import { logoutUserFn } from '@/services/authApi';

const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();
const clickedmenu = ref(false);
const clickprocessdropdown = ref(false);
const bellanimation = ref(false);

let authStore = useAuthStore();
const { cookies } = useCookies();

onMounted(() => {
  window.addEventListener('click', function (e) {
    if (clickedmenu.value === true && (e.target.id != "dropdown")) {
      clickedmenu.value = false;
    }
  });

})

const Logout = async () => {
  authStore.logoutUser();
  router.push({ path: '/login' })
};

const sendToNotificationPage = () => {
  router.push({ path: '/notifications' })
}
</script>
<style>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


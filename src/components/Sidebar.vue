<template>
  <div
      :class="sidebarIsOpen ? 'max-w-[270px] min-w-[270px]' : 'min-w-[64px] max-w-[64px]'"
      class="bg-blue-100 shadow-sm flex flex-col h-[100vh] border-r border-gray-200 font-medium text-primary  transition-width duration-300 ease-in-out bg-blue-100"
  >
    <div
        @click="toggleSidebar"
        class="absolute hover:scale-110 -right-4 top-24 bg-white w-7 h-7 flex items-center justify-center rounded-full shadow-md transition ease-in-out"
    >
      <img
          class="w-2 transition ease-in-out duration-300"
          :class="sidebarIsOpen ? '' : 'rotate-180'"
          src="@/assets/img/arrow_left.svg"
      />
    </div>
      <div class="flex items-center">
<!--        <img class="w-42 pl-4 py-6" src="@/assets/img/logowhite_icon.svg" />-->
<!--        <img-->
<!--            :class="sidebarIsOpen ? 'opacity-1' : 'opacity-0'"-->
<!--            class="min-w-[160px] py-6 transition-all"-->
<!--            src="@/assets/img/ccswhite.svg"-->
<!--        />-->
      </div>
    <div
        class="navigation-container mt-12"
        :class="sidebarIsOpen ? '' : 'overflow-hidden'"
    >
      <div class="buzz-out-on-hover">
        <RouterLink to="/">
          <div class="flex items-center space-x-4">
            <img class="w-6" src="@/assets/img/dashboard_icon.svg" />
            <p class="transition-all" :class="sidebarIsOpen ? 'block opacity-1' : 'opacity-0'">Dashboard</p>
          </div>
        </RouterLink>
      </div>
      <div class="buzz-out-on-hover">
        <RouterLink to="/domains/">
          <div class="flex items-center space-x-4 buzz-out-on-hover">
            <img class="w-6" src="@/assets/img/domains_icon.svg" />
            <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Domains</p>
          </div>
        </RouterLink>
      </div>
      <div class="buzz-out-on-hover">
        <RouterLink to="/servers/">
          <div class="flex items-center space-x-4 buzz-out-on-hover">
            <img class="w-6" src="@/assets/img/server_icon.svg" />
            <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Servers</p>
          </div>
        </RouterLink>
      </div>
      <div class="buzz-out-on-hover">
        <RouterLink to="/notifications/">
          <div class="flex items-center space-x-4 buzz-out-on-hover">
            <img class="w-6" src="@/assets/img/notifications_icon.svg" />
            <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Notifications</p>
          </div>
        </RouterLink>
      </div>
      <div class="buzz-out-on-hover">
        <RouterLink to="/guidance/">
          <div class="flex items-center space-x-4 buzz-out-on-hover">
            <img class="w-6" src="@/assets/img/guide_icon.svg"/>
            <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Guidance</p>
          </div>
        </RouterLink>
      </div>
      <div class="buzz-out-on-hover">
        <RouterLink to="/results/">
          <div class="flex items-center space-x-4 buzz-out-on-hover">
            <img class="w-6" src="@/assets/img/results_icon.svg">
            <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Results</p>
          </div>
        </RouterLink>
      </div>
      <div class="buzz-out-on-hover">
        <RouterLink to="/operations/">
          <div class="flex items-center space-x-4 buzz-out-on-hover">
            <img class="w-6" src="@/assets/img/automatic_operations_icon.svg">
            <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Automatic Operations</p>
          </div>
        </RouterLink>
      </div>
      <div class="buzz-out-on-hover">
        <RouterLink to="/tasks/">
          <div class="flex items-center space-x-4 buzz-out-on-hover">
            <img class="w-6" src="@/assets/img/tasks_icon.svg">
            <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Tasks</p>
          </div>
        </RouterLink>
      </div>

<!--      <div class="buzz-out-on-hover">-->
<!--        <a class="cursor-pointer">-->
<!--          <div class="flex justify-between items-center w-full">-->
<!--            <div @click="toggleSettingsDropdown" class="flex items-center space-x-4 buzz-out-on-hover">-->
<!--              <img class="w-6" src="@/assets/img/settings_icon.svg">-->
<!--              <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Settings</p>-->
<!--            </div>-->
<!--            <img class="pointer-events-none transition ease-in-out duration-500"-->
<!--                 :class="{-->
<!--                  'opacity-0': !sidebarIsOpen,-->
<!--                  'block': sidebarIsOpen,-->
<!--                  'rotate-180': dropdownSettingsIsOpen,-->
<!--                  'rotate-0': !dropdownSettingsIsOpen,-->
<!--                }"-->
<!--                 src="@/assets/img/down_white.svg">-->
<!--          </div>-->
<!--        </a>-->
<!--      </div>-->
      <div @click="Logout" class="buzz-out-on-hover custom-logout cursor-pointer">
          <div class="flex items-center space-x-4 buzz-out-on-hover">
            <img class="w-6" src="@/assets/img/logout_icon.svg">
            <p class="transition-all" :class="sidebarIsOpen ? 'block' : 'opacity-0'">Logout</p>
          </div>
      </div>
    </div>
<!--    <button
        :class="sidebarIsOpen ? 'pl-3 pr-12 w-[90%]' : 'pl-2 w-[70%]'"
        @click="Logout"
        class="button-logout border-white border rounded-md font-semibold transition ease-in-out py-2 flex absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center hover:bg-hoverthird"
    >
      <img
          class="ml-2 transition-all ease-in-out duration-300 w-6"
          src="@/assets/img/logout_icon.svg"
      />
      <span :class="sidebarIsOpen ? 'min-w-[130px]' : 'opacity-0 w-1 h-1'"
      >Log out</span
      >
    </button>-->
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCookies } from "vue3-cookies";
import { logoutUserFn } from "@/services/authApi";
import { useRoute, useRouter } from "vue-router";

let authStore = useAuthStore();

const router = useRouter();
const { cookies } = useCookies();

const dropdownClientsIsOpen = ref(false);
const dropdownTicketsIsOpen = ref(false);
const dropdownSettingsIsOpen = ref(false);
const sidebarIsOpen = ref(true);
const toggleSidebar = () => {
  sidebarIsOpen.value = !sidebarIsOpen.value;
  if (sidebarIsOpen.value === false) {
    dropdownClientsIsOpen.value = false;
    dropdownTicketsIsOpen.value = false;
    dropdownSettingsIsOpen.value = false;
  }
};
const toggleClientsDropdown = () => {
  dropdownClientsIsOpen.value = !dropdownClientsIsOpen.value;
};
const toggleTicketsDropdown = () => {
  dropdownTicketsIsOpen.value = !dropdownTicketsIsOpen.value;
}
const toggleSettingsDropdown = () => {
  dropdownSettingsIsOpen.value = !dropdownSettingsIsOpen.value;
}

const Logout = async () => {
  authStore.logoutUser();
  router.push({ path: "/login" });
};
</script>

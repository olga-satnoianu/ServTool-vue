<template >
  <div class="flex" v-if="authStore.isLoggedIn()">
    <Sidebar/>
    <div class="w-full px-8 bg-pagebg overflow-y-scroll h-[100vh]">
      <Navigation/>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">

import { RouterView } from 'vue-router'
import Navigation from '@/components/Navigation.vue';
import Sidebar from '@/components/Sidebar.vue';
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();
</script>

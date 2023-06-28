<template>
  <div>
    <Navigation></Navigation>

    <div class="flex w-full">
     <svg :class="clicked_menu? 'hidden':''" @click="lock_bodyScroll" class="cursor-pointer lg:hidden fixed z-50 top-4 left-5 h-7 w-7 fill-black hover:fill-primary" height="384pt" viewBox="0 -53 384 384" width="384pt" xmlns="http://www.w3.org/2000/svg"><path d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/><path d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/><path d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/></svg>
      <svg @click="unlock_bodyScroll" :class="clicked_menu? 'transform translate-x-[0px] transition-all':'transition-all transform -translate-x-[300px]'" class="cursor-pointer lg:hidden fixed z-[999] top-4 left-[270px] h-5 w-5 fill-black hover:fill-primary"  viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g id="_02_User" data-name="02 User"><path d="m25 512a25 25 0 0 1 -17.68-42.68l462-462a25 25 0 0 1 35.36 35.36l-462 462a24.93 24.93 0 0 1 -17.68 7.32z"/><path d="m487 512a24.93 24.93 0 0 1 -17.68-7.32l-462-462a25 25 0 0 1 35.36-35.36l462 462a25 25 0 0 1 -17.68 42.68z"/></g></svg>
<!--
     <Sidebar v-model="clicked_menu" :class="clicked_menu? 'z-50 h-[100vh] bg-white grid transform -translate-x-[0px] transition-all' :'transition-all transform -translate-x-[500px] lg:grid  h-custom1' " class="grid grid-cols-1"></Sidebar>&ndash;&gt;
-->
      <Sidebar v-model="clicked_menu"  class="hidden fixed left-0 top-0 lg:grid z-50 bg-white grid-cols-1"></Sidebar>
          <Transition name="fade" appear>
            <div class="w-custom left-[270px] relative mt-[85px] px-20 py-5">
              <RouterView/>
            </div>
          </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Navigation from "@/components/Navigation.vue";
const route = useRoute();
import Sidebar from "@/components/Sidebar.vue";
import {useRoute} from "vue-router";
const clicked_menu = ref(false);
const lock_bodyScroll = () => {
  clicked_menu.value=!clicked_menu.value;
  document.body.classList.add('lock_body_scroll');
}
const unlock_bodyScroll = () => {
  clicked_menu.value = false;
  document.body.classList.remove('lock_body_scroll');
}
</script>

<style scoped>
.w-custom{
  width:calc(100vw - 270px);
}
@media only screen and (max-width: 1280px) {
  .w-custom{
    width:calc(100vw - 230px);
  }
}

@media only screen and (max-width: 1024px) {
  .w-custom{
    width:100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>

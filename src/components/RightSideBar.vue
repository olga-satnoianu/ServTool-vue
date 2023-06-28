<template>
  <div ref="rightSideBar" @keydown.esc="$emit('close')" tabindex="-1">
    <div
        @click="$emit('close')"
        :class="props.show ? 'block' : 'hidden'"
         class="bg-black h-full w-full fixed left-0 right-0 top-0 z-40 opacity-30"></div>
    <div
        :class="getShowClasses()"
        class="fixed  h-[100vh] right-0 top-0 bg-white p-6 transform transition-all shadow-2xl overflow-y-auto z-50"
    >
      <img @click="$emit('close')" class="cursor-pointer" src="@/assets/img/back_dark.svg">
      <div class="md:px-3 lg:px-12">
        <p class="text-2xl mt-10 mb-6">{{ props.title }}</p>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, ref, watch} from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false
  },
  title: {
    type: String,
    required: true,
    default: ""
  },
  size: {
    type: String,
    required: false,
    default: "sm"
  },
});

const rightSideBar = ref<HTMLDivElement|null>(null);

const emit = defineEmits(["close"]);

onMounted(() => {
  //console.log('aaaa', rightSideBar);
})

const isShown = computed(() => {
  return props.show;
});

watch(isShown, (show) => {
    const firstInput = rightSideBar.value?.querySelector('input');
    if(firstInput !== null && firstInput !== undefined)
    {
        firstInput.focus();
    }
    else
    {
        rightSideBar.value?.focus();
    }
})

const getShowClasses = () => {
  if(props.show === false)
  {
    switch (props.size)
    {
      case 'xl':
        return 'translate-x-[1200px] w-full xl:w-[1200px]';
      case 'l':
        return 'translate-x-[700px] w-full md:w-[700px]';
      default:
        return 'translate-x-[650px] w-full sm:w-[500px]';
    }
  }
  else
  {
    switch (props.size)
    {
      case 'xl':
        return 'translate-x-0 w-full xl:w-[1200px]';
      case 'l':
        return 'translate-x-0 w-full md:w-[700px]';
      default:
        return 'translate-x-0 w-full  sm:w-[500px]';
    }
  }
};

</script>

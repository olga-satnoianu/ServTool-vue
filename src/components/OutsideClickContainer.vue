<template>
  <div ref="container" class="absolute w-full">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
const container = ref();
const emit = defineEmits(["outside-click"]);

const checkClick = (e: Event) => {
  e?.stopPropagation();
  if (!container.value?.contains(e?.target)) {
    emit("outside-click");
  }
};

onMounted(() => {
  setTimeout(() => {
    document.addEventListener("click", checkClick, false);
  }, 1);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", checkClick, false);
});
</script>

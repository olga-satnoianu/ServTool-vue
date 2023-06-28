<template>
  <div class="relative flex items-center gap-1">
    <input
      type="checkbox"
      v-model="toggler"
      :required="required"
      :id="id"
      @invalid.prevent="displayInvalidInput($event)"
      :class="showValidationMessage ? 'border-red-700' : 'text-purple-200'"
    />
    <p v-if="showValidationMessage" class="text-red-700 text-xs mt-1/2">
      * Required
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useFormsStore } from "@/stores/forms";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: { type: Boolean, default: false, required: true },
  required: { type: Boolean, default: false },
  noScrollOnError: { type: Boolean, default: false },
  label: String,
});
const formsStore = useFormsStore();
const showValidationMessage = ref(false);
const id = formsStore.useSlug(props.label);

const displayInvalidInput = (event: Event) => {
  showValidationMessage.value = true;
  formsStore.scrollToInvalidInput(event, props.noScrollOnError);
};

const toggler = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    if (val) {
      showValidationMessage.value = false;
    }
    emit("update:modelValue", val);
  },
});
</script>
<style scoped></style>

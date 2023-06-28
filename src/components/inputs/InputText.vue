<template>
  <div class="relative w-72 md:w-80 lg:w-96">
    <label :for="id" class="text-black text-xs font-bold">
      {{ label }}
    </label>
    <input
        :disabled="disabled"
      :id="id"
      :autocomplete="autocompleteOff ? 'new-name' : ''"
      :value="modelValue || ''"
      :required="required"
      :name="name"
      type="text"
      class="h-10 w-full text-primary rounded-md text-sm px-4 font-medium outline-none drop-shadow-sm transition-all duration-200 ease-in-out"
      @invalid.prevent="displayInvalidInput($event)"
      :class="
        showValidationMessage
          ? 'border-2 border-red-700'
          : 'focus:bg-white focus:ring-2 focus:ring-third  border-border border'
      "
      @input="startInput($event)"
    />
    <p
      v-if="showValidationMessage"
      class="text-red-700 top-16 text-xs absolute"
    >
      * Value required
    </p>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useFormsStore } from "@/stores/forms";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: { type: String, default: "", required: true },
  required: Boolean,
  disabled: Boolean,
  label: String,
  name: String,
  autocompleteOff: Boolean,
  noScrollOnError: { type: Boolean, default: false },
});

const formsStore = useFormsStore();
const showValidationMessage = ref(false);
const id = formsStore.useSlug(props.label);

const displayInvalidInput = (event: Event) => {
  showValidationMessage.value = true;
  formsStore.scrollToInvalidInput(event, props.noScrollOnError);
};

const startInput = (event: Event) => {
  showValidationMessage.value = false;
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

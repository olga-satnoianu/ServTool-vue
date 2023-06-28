<template>
  <div class="relative w-72 md:w-80 lg:w-96">
    <label :for="id" class="text-gray1 text-xs">
      {{ label }}
    </label>
    <input
        :id="id"
        :autocomplete="autocompleteOff ? 'new-number' : ''"
        :value="modelValue"
        :required="required"
        :name="name"
        :min="minValue"
        :step="step"
        type="number"
        class="h-10 w-full text-primary rounded-md text-sm px-4 font-medium outline-none drop-shadow-sm transition-all duration-200 ease-in-out"
        @invalid.prevent="displayInvalidInput($event)"
        @blur.prevent="blurInput()"
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
import type { PropType } from "vue";
import { useFormsStore } from "@/stores/forms";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: { type: Number, default: 0.00, required: true },
  required: Boolean,
  label: String,
  name: String,
  autocompleteOff: Boolean,
  minValue: { type: Number, default: "0.00" },
  step: { type: String as PropType<"0.01">, default: "0.01" },
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
  emit("update:modelValue", Number((event.target as HTMLInputElement).value));
};

const blurInput = () => {
  if (Number(props.modelValue) < Number(props.minValue)) {
    emit("update:modelValue", Number(props.minValue));
    showValidationMessage.value = false;
  }
};
</script>

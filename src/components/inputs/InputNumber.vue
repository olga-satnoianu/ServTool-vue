<template>
  <div class="relative w-72 md:w-80 lg:w-96 ">
    <label
        class="font-bold text-[#0A285A] text-xs"
        :class="availble? '':'text-gray1'"
        :for="id"
    >
      {{ label }}
    </label>
    <input
        :disabled="available"
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
        available? 'bg-[#F7F7F7] text-gray1':'text-primary',
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
    <p  v-if="showPencil === true"
        @click="available = !available"
        :class="available ? 'flex' : 'hidden'"
        class="text-red-700 top-16 text-xs absolute z-10 h-full right-[15px] top-[52%]"
    >
      <img class="w-4 h-4" src="@/assets/img/pencil-black.svg" />
    </p>
  </div>
</template>
<script setup lang="ts">
import {computed, ref} from "vue";
import type { PropType } from "vue";
import { useFormsStore } from "@/stores/forms";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: { type: Number, default: 0, required: true },
  required: Boolean,
  disabled: Boolean,
  label: String,
  showPencil: Boolean,
  name: String,
  autocompleteOff: Boolean,
  minValue: { type: String, default: "0" },
  step: { type: String as PropType<"1" | ".01">, default: "1" },
  noScrollOnError: { type: Boolean, default: false },
});


const formsStore = useFormsStore();
const showValidationMessage = ref(false);
const id = formsStore.useSlug(props.label);

const available = ref(props.disabled);

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

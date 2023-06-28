<template>
  <div class="relative w-72 md:w-80 lg:w-96">
    <label :for="id" @click="showOptions()" class="font-bold text-[#0A285A] text-xs">
      {{ label }}
    </label>
    <div
      @click="showOptions()"
      class="h-10 w-full text-primary rounded-md text-sm px-4 font-medium outline-none drop-shadow-sm transition-all duration-200 ease-in-out flex items-center"
      :class="[
        isActive && !showValidationMessage ? 'border-third border-2' : '',
        !isActive && !showValidationMessage ? 'border-border border' : '',
        showValidationMessage ? 'border-red-700 border-2' : '',
      ]"
    >
      <p v-if="model || model === 0">{{ model }}</p>
      <img class="w-4 h-4 absolute right-3" src="@/assets/img/arrow-down-sign-to-navigate.svg" />
    </div>
    <p
      v-if="showValidationMessage"
      class="text-red-700 text-xs top-16 absolute"
    >
      * Value required
    </p>
    <outside-click-container @outside-click="isActive = false" v-if="isActive">
      <div
        v-if="isActive"
        :class="{ 'h-72 overflow-y-scroll custom-scrollbar': scrollable }"
        class="px-4 bg-white rounded-md absolute w-full z-10 shadow-md border-border border"
      >
        <div
          class="flex items-center py-2 text-xs lg:text-sm font-normal select-none cursor-pointer"
          @click="selectModel(e)"
          v-for="e in options"
          :key="e"
        >
          {{ e }}
        </div>
      </div>
    </outside-click-container>

    <select
      class="hidden"
      :id="id"
      :required="required"
      @invalid.prevent="displayInvalidInput()"
      ref="hiddenSelect"
    >
      <option value=""></option>
      <option v-for="value in options" :value="value" :key="value">
        {{ value }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import type { PropType } from "vue";
import OutsideClickContainer from "@/components/OutsideClickContainer.vue";
import { useFormsStore } from "@/stores/forms";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  label: { type: String },
  required: { type: Boolean },
  scrollable: { type: Boolean },
  options: { type: Array as PropType<Array<string | number>>, required: true },
  modelValue: { type: [String, Number], required: true, default: "" },
});

const formsStore = useFormsStore();
const isActive = ref(false);
const id = formsStore.useSlug(props.label);
const hiddenSelect = ref();
const showValidationMessage = ref(false);

const displayInvalidInput = () => {
  showValidationMessage.value = true;
};

const model = computed({
  get() {
    return props.modelValue;
  },
  set(val: any) {
    emit("update:modelValue", val);
  },
});

const showOptions = () => {
  isActive.value = true;
};

const selectModel = (e: number | string) => {
  isActive.value = false;
  model.value = e;
  hiddenSelect.value.value = e;
  showValidationMessage.value = false;
};
</script>

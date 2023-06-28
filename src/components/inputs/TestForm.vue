<template>
  <form
    @submit.prevent="submitTestForm($event)"
    class="bg-white rounded-md w-fit p-8 mt-4 flex flex-col gap-4"
  >
    <input-text :no-scroll-on-error="true" v-model="full_name" required label="Full Name"></input-text>
    <input-text v-model="company" label="Company not required"></input-text>
    <input-text v-model="address" label="Address" required></input-text>
    <input-number
      v-model="number"
      label="Number"
      min-value="0"
      step=".01"
      required
    ></input-number>
    <input-email v-model="email" label="Email" required></input-email>
    <input-checkbox
      v-model="checkbox"
      label="Checkbox"
      :no-scroll-on-error="true"
      required
    ></input-checkbox>

    <!-- v-model="primitives" label="Select" :scrollable="true" required -->
    <input-select-primitives
      :options="primitives"
      v-model="primitive"
      label="Select a value"
      :scrollable="true"
    ></input-select-primitives>


    <input-select
      :options="selectOptions"
      v-model="option"
      iterable-key="id"
      property="value"
      label="Select a value"
      required
    ></input-select>


    <input-tel
      v-model="phone"
      label="Tel"
      required
    ></input-tel>
    <input-textarea
      v-model="textareaModel"
      label="Textarea"
      required
    ></input-textarea>
    <button name="update"  class="bg-third text-white py-2 px-4 rounded-md mt-20">Update</button>
    <button name="create"  class="bg-third text-white py-2 px-4 rounded-md mt-2">Create</button>
  </form>
</template>
<script setup lang="ts">
import { ref } from "vue";
import InputText from "@/components/inputs/InputText.vue";
import InputEmail from "@/components/inputs/InputEmail.vue";
import InputNumber from "@/components/inputs/InputNumber.vue";
import InputCheckbox from "@/components/inputs/InputCheckbox.vue";
import InputSelectPrimitives from "@/components/inputs/InputSelectPrimitives.vue";
import InputSelect from "@/components/inputs/InputSelect.vue";
import InputTextarea from "@/components/inputs/InputTextarea.vue";
import InputTel from "@/components/inputs/InputTel.vue";

const full_name = ref("");
const company = ref("");
const email = ref("");
const address = ref("");
const checkbox = ref(false);
const number = ref(0);
const primitives = ref(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "1", "2", "3", "4", "5", "6", "7",]);
const primitive = ref("");
const phone = ref("");
const textareaModel = ref("");
const option = ref();
const selectOptions = ref([
  { id: 1, value: "One" },
  { id: 2, value: "Two" },
  { id: 3, value: "Three" },
  null,
  undefined,
  [],
  "",
]);

const submitTestForm = (event: SubmitEvent) => {
  const button = event.submitter as HTMLInputElement;
  console.log(button.name);

  // if (button.name === "create") callCreateFunction();
  // if (button.name === "update") callUpdateFunction();

  console.log("Submitting test form`");
};

// import TestForm from "@/components/inputs/TestForm.vue";
// <test-form></test-form>
</script>

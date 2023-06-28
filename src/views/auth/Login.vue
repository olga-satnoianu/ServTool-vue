<template>
  <div class="flex w-full h-[100vh]">
    <div class="hidden lg:flex lg:w-3/4 bg-white items-center justify-center border-r border-gray-200">
      <img class="w-[100%] h-[100vh] object-cover" src="@/assets/img/login.jpg">
    </div>
    <div v-if="form_type == 0" class="w-full lg:w-1/4 h-full bg-white flex justify-center flex-col px-12 items-center">
              <img class="py-40 max-w-[300px] mx-auto" src="@/assets/img/servtool_icon.jpg">
      <p class="text-lg font-bold pb-4 ">Welcome back!</p>
      <!--        <p class="text-lg font-bold pb-4">{{ "nav.welcome_login_page" }}</p>-->

      <button type="submit"
              @click="login()"
              class="max-w-md w-full py-3.5 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full">Login
      </button>
      <br>
      <button type="submit"
              class="max-w-md w-full py-1 flex items-center justify-center border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
              @click="loginWithGoogle()"><img class="w-12" src="@/assets/img/g_icon.svg"><span class="text-center font-semibold">Login with Google</span>
      </button>
      <br>
      <br>
      <div class="bg-white flex justify-center flex-col px-15 items-center mt-10">
        <p class="text-s font-bold pb-4">You don't have an account already? Register now!</p>

        <button type="submit"
                class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
                @click="form_type = 2">Register
        </button>
      </div>
    </div>
    <div v-else class="w-full lg:w-1/4 h-full bg-white flex justify-center flex-col px-12 items-center">
      <img class="py-20 max-w-[300px] mx-auto" src="@/assets/img/servtool_icon.jpg">
      <form @submit.prevent="register()">
        <input-text v-model="register_user.first_name" required label="First Name"></input-text>
        <input-text v-model="register_user.last_name" required label="Last Name"></input-text>
        <input-email v-model="register_user.email" required label="Email"></input-email>
        <input-password v-model="register_user.password" required label="Password"></input-password>
        <input-password v-model="verify_password" required label="Verify Password"></input-password>
        <br>
        <button type="submit"
                class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
        >Register
        </button>
      </form>
      <br>
      <button type="button"
              class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
              @click="form_type = 0">I already have an account!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useApiStore} from "@/stores/api";
import {ref} from "vue";
import InputText from "@/components/inputs/InputText.vue";
import {User, type UserData} from "@/types/user";
import InputEmail from "@/components/inputs/InputEmail.vue";
import {showError} from "@/services/showMessages";
import router from "@/router";
import InputPassword from "@/components/inputs/InputPassword.vue";

const api = useApiStore();
const loading_true = ref(false);
const login_user = ref<User>({} as User);
const register_user = ref<User>({} as User);
const form_type = ref(0);
const verify_password = ref('');

const register = () => {
  loading_true.value = true;

  if (register_user.value.email.trim() === "") {
    showError("Register error", "Email is mandatory");
    return;
  }

  if (register_user.value.first_name.trim() === "") {
    showError("Register error", "First name is mandatory");
    return;
  }

  if (register_user.value.last_name.trim() === "") {
    showError("Register error", "Last name is mandatory");
    return;
  }

  if (register_user.value.password.trim().length < 6) {
    showError("Register error", "Password must be at least 6 characters");
    return;
  }

  if (register_user.value.password.trim() !== verify_password.value.trim()) {
    showError("Register error", "Password doesn't match verify password");
    return;
  }

  api.createItem<User, UserData>('users', register_user.value, User)
      .then((_user) => {

      })
      .finally(() => {
        loading_true.value = false;
        window.location.href = router.resolve({name: 'home'}).href;
      })
}
const login = () => {
  loading_true.value = true;
  window.location.href = `${api.BASE_URL}/api/redirect`

}
const loginWithGoogle = () => {
  loading_true.value = true;
  window.location.href = `${api.BASE_URL}/api/redirectGoogle`
}
</script>
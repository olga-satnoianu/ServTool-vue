import {ref} from "vue";
import {defineStore} from "pinia";
import type {LoginCallbackResponse} from "@/types/auth";
import {useApiStore} from "@/stores/api";
import {User} from "@/types/user";
import type {UserData} from "@/types/user";
import {AccountPermissions} from "@/types/AccountPermission";

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string>();
    const refreshToken = ref<string>();
    const isLoggedIn = ref(false);
    const api = useApiStore();
    const user = ref<User|null>(null);

    const initApp = () => {
        const localToken = localStorage.getItem('token');
        const localRefreshToken = localStorage.getItem('refreshToken');
        if (localToken !== null && localToken !== undefined && localRefreshToken !== null && localRefreshToken !== undefined) {
            token.value = localToken;
            refreshToken.value = localRefreshToken;

            api.axiosApi.interceptors.request.use(function (config) {
                if (config.headers === undefined) {
                    return config;
                }
                config.headers["Authorization"] = `Bearer ${token.value}`;
                return config;
            });

            api.axiosAuth.interceptors.request.use(function (config) {
                if (config.headers === undefined) {
                    return config;
                }
                config.headers["Authorization"] = `Bearer ${token.value}`;
                return config;
            });
        }

    }

    const loginUser = (user_data: LoginCallbackResponse) => {
        token.value = user_data.token?user_data.token:user_data.access_token;
        refreshToken.value = user_data.refreshToken?user_data.refreshToken:user_data.refresh_token;

        localStorage.setItem('token', token.value);
        localStorage.setItem('refreshToken', refreshToken.value);

        api.axiosApi.interceptors.request.use((config) => {
            if (config.headers === undefined) {
                return config;
            }
            config.headers["Authorization"] = `Bearer ${token.value}`;
            return config;
        });

        api.axiosAuth.interceptors.request.use(function (config) {
            if (config.headers === undefined) {
                return config;
            }
            config.headers["Authorization"] = `Bearer ${token.value}`;
            return config;
        });

    }

    const setUser = (_user:UserData) => {
        user.value = new User();
        user.value.id = _user.id;
        user.value.first_name = _user.first_name; //data.user['given_name']
        user.value.last_name = _user.last_name;   //data.user['family_name']
        user.value.email = _user.email;

    }

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        token.value = "";
        refreshToken.value = "";

        api.axiosApi.interceptors.request.use((config) => {
            if (config.headers === undefined) {
                return config;
            }
            config.headers["Authorization"] = undefined;
            return config;
        });

        api.axiosAuth.interceptors.request.use(function (config) {
            if (config.headers === undefined) {
                return config;
            }
            config.headers["Authorization"] = undefined;
            return config;
        });

        isLoggedIn.value = false;
        user.value = null;

    }

    return {token, refreshToken, isLoggedIn, user, initApp, loginUser, setUser, logoutUser};
});
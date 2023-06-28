import axios from 'axios';
import { useCookies } from "vue3-cookies";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from 'vue-router';
import type { AxiosRequestConfig } from "axios";
import { ref } from "vue";
import type { UserData } from '@/types/user';

const { cookies } = useCookies();

const configApi: AxiosRequestConfig = {
    baseURL: `${import.meta.env.VITE_APP_CLIENT}`,
    withCredentials: true,
};

const axiosApi = ref(axios.create(configApi));

axiosApi.value.defaults.headers.common['Content-Type'] = 'application/json';
axiosApi.value.defaults.headers.common['Authorization'] = `Bearer ${cookies.get('token')}`;

export const refreshAccessTokenFn = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const authStore = useAuthStore();
        await axiosApi.value.get(`${import.meta.env.VITE_APP_CLIENT}/auth/token`, {
            params: {
                refreshToken: cookies.get('refreshToken'),
            }
        }).then((response) => {
            authStore.setToken(response.data.access_token, response.data.refresh_token);

            cookies.set("token", response.data.access_token, '', '/', `${import.meta.env.VITE_DOMAIN_COOKIE}`);
            cookies.set("refreshToken", response.data.refresh_token, '', '/', `${import.meta.env.VITE_DOMAIN_COOKIE}`);
            resolve();
        }).catch((error) => {
            reject("An error has occured");
        });
    });
};

axiosApi.value.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await refreshAccessTokenFn();
            return axiosApi.value({
                ...originalRequest,
                headers: {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${cookies.get('token')}`
                },
                sent: true
            });
        }
        return Promise.reject(error);
    }
);

export const loginUserFn = async (): Promise<unknown> => {
    return new Promise(async (resolve, reject) => {
        const authStore = useAuthStore();
        const route = useRoute();
        const router = useRouter();

        await axiosApi.value.get(`${import.meta.env.VITE_APP_CLIENT}/auth/callback`, { params: route.query })
            .then((response) => {
                authStore.setToken(response.data.token, response.data.refreshToken);
                authStore.setUser(response.data);
                cookies.set("token", response.data.token, '', '/', `${import.meta.env.VITE_DOMAIN_COOKIE}`);
                cookies.set("refreshToken", response.data.refreshToken, '', '/', `${import.meta.env.VITE_DOMAIN_COOKIE}`);
                axiosApi.value.defaults.headers.common['Authorization'] = `Bearer ${cookies.get('token')}`;

                router.push({ path: '/' });
            }).catch((error) => {
                router.push('/login');
                console.log('store function error', error);
                reject("An error has occured");
            });
    });
};

export const getMeFn = async (): Promise<UserData> => {
    return new Promise(async (resolve, reject) => {
        const authStore = useAuthStore();
        console.log('api/user');
        await axiosApi.value.get(`${import.meta.env.VITE_APP_CLIENT}/api/user`)
            .then(response => {
                authStore.setUser(response.data);
                resolve(response.data);
            })
            .catch((error) => {
                console.log('store function error', error);
                reject("An error has occured");
            });
    });
};

export const logoutUserFn = async (): Promise<UserData> => {

    return new Promise(async (resolve, reject) => {
        const authStore = useAuthStore();

        await axiosApi.value.get(`${import.meta.env.VITE_APP_CLIENT}/api/user/logout`)
            .then((response) => {
                authStore.token = null;
                authStore.refreshToken = null;
                cookies.remove('token', '', `${import.meta.env.VITE_DOMAIN_COOKIE}`);
                cookies.remove('refreshToken', '', `${import.meta.env.VITE_DOMAIN_COOKIE}`);
                resolve(response.data);
            })
            .catch((error) => {
                console.log('store function error', error);
                reject("An error has occured");
            });
    });
}


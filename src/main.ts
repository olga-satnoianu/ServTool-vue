import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "./assets/style.css";
import "./assets/main.css";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App)
app.use(VueApexCharts);
app.component('EasyDataTable', Vue3EasyDataTable);
app.use(createPinia());
app.use(router);

import LayoutLoggedIn from '@/layouts/LayoutLoggedIn.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';

app.component('LayoutLoggedIn', LayoutLoggedIn);
app.component('LayoutGuest', LayoutGuest);

app.mount('#app')

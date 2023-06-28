import { ref } from "vue";
import { defineStore } from "pinia";
import {useApiStore} from "@/stores/api";
import {Notification, type NotificationData} from "@/types/notifications";

export const useNotificationStore = defineStore("notifications", () => {

    const api = useApiStore();

    const notifications = ref<Notification[]>([]);
    const count_notifications = ref(0);

    function getNotifications(): Promise<void> {
        return new Promise((resolve, reject) => {
            api.axiosApi.get(`/notifications`)
                .then((response) => {
                    notifications.value = [];
                    const notifications_list: NotificationData[] = api.jsonApiDeserialize('notifications', response.data);
                    notifications_list.forEach(n => {
                        notifications.value.push(new Notification(n));
                    })
                    count_notifications.value = notifications_list.filter((el) => el.status === 0).length;
                    resolve();
                })
                .catch((error) => {
                    console.log('store function error', error);
                    reject("An error has occured");
                })
        });
    }

    function countNotifications(): number{
        getNotifications();
        return count_notifications;
    }

    return { notifications, count_notifications, getNotifications, countNotifications };
});


<template>
  <div>
    <template v-if="is_loading === true">
      Loading data...

    </template>
    <template v-else>
      <div class="font-semibold">
        Notifications
        <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
          <input-select-primitives @click="showNotifications(title_type)"
                                   :options="titles"
                                   v-model="title_type"
                                   label="Select notification type">
          </input-select-primitives>

          <input-select @click="changeStatus(status.status)"
                        :options="statuses"
                        v-model="status.status"
                        iterable-key="id"
                        property="value"
                        label="Change Status"
                        :class="itemsSelected.length > 0 ? '' : 'opacity-40'">
          </input-select>
        </div>
        <br>
        <div>
          <EasyDataTable
              v-model:items-selected="itemsSelected"
              :headers="headers"
              :items="show_notifications"
              :theme-color="themeColor"
              :search-value="searchValue"
              :loading="is_loading"
              table-class-name="customize-table"
          >
            <template #item-domain="item">
              <template v-for="domain in all_domains">
                <div v-if="domain.id === item.domain_id">
                  {{ domain.name }}
                </div>
              </template>
            </template>
            <template #item-type="item">
              <template v-if="item.task_id">
                Task
              </template>
              <template v-if="item.major_event_id">
                Alert
              </template>
            </template>
            <template #item-entity="item">
              <template v-if="item.domain_id">
                <template v-for="domain in all_domains">
                  <div v-if="domain.id === item.domain_id">
                   Domain: {{ domain.name }}
                  </div>
                </template>
              </template>
              <template v-if="item.server_id">
                <template v-for="server in all_servers">
                  <div v-if="server.id === item.server_id">
                    Server: {{ server.name }}
                  </div>
                </template>
              </template>
            </template>
            <template #item-status="item">
              <div v-if="item.status === 1" class="bg-green-50 border-green-500 text-green-500">
                Looks good
              </div>
              <div v-else class="bg-red-50 border-red-500 text-red-500">
                Trouble
              </div>
            </template>
            <template #item-createdAt="item">
              <template v-if="item.createdAt">
                <span>{{ item.createdAt.toISOString().split("T")[0] }} {{ item.createdAt.toISOString().split("T")[1].split(".")[0] }}</span>
              </template>
            </template>
            <template #item-updatedAt="item">
              <template v-if="item.createdAt.toISOString() !== item.updatedAt.toISOString()">
                <span>{{ item.updatedAt.toISOString().split("T")[0] }} {{ item.updatedAt.toISOString().split("T")[1].split(".")[0] }}</span>
              </template>
            </template>
          </EasyDataTable>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRouter, useRoute} from "vue-router";
import {useApiStore} from "@/stores/api";
import type { Header, Item, ServerOptions, FilterOption } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";
import InputSelectPrimitives from "@/components/inputs/InputSelectPrimitives.vue";
import {showError, showInfo, showSuccess} from "@/services/ShowMessages";
import {Notification, type NotificationData} from "@/types/notifications";
import {Domain, type DomainData} from "@/types/domains";
import {Server, ServerData} from "@/types/servers";
import InputSelect from "@/components/inputs/InputSelect.vue";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();
const is_loading = ref(true);
const is_saving = ref(false);
const itemsSelected = ref<Notification[]>([]);

const themeColor = "#40a48e";
const searchValue = ref("");
const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Type", value: "type", sortable: true },
  { text: "Title", value: "title", sortable: true },
  { text: "Entity", value: "entity", sortable: true },
  { text: "Description", value: "description", sortable: true },
  // { text: "Importance", value: "importance", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Trigger Time", value: "createdAt", sortable: true },
  { text: "Fix Time", value: "updatedAt", sortable: true },
];

const title_type = ref('');
const titles = [
  'Tasks',
  'Alerts',
  'All'
];
const statuses = [
  {id: 0, status: 0, value: "Trouble"},
  {id: 1, status: 1, value: "Looks good"}
];
const status = ref({});
const all_notifications = ref<Notification[]>([]);
const show_notifications = ref<Notification[]>([]);
const all_domains = ref<Domain[]>([]);
const all_servers = ref<Server[]>([]);

const servers = apiStore.getItems<Server, ServerData>("servers", Server);
const domains = apiStore.getItems<Domain, DomainData>("domains", Domain);
const notifications = apiStore.getItems<Notification, NotificationData>("notifications", Notification);

Promise.allSettled([servers, domains, notifications])
    .then(([serversP, domainsP, notificationsP]) => {
      if (serversP.status !== "fulfilled") {
        console.log("failed reading servers data");
        return;
      }
      if (domainsP.status !== "fulfilled") {
        console.log("failed reading domains data");
        return;
      }
      if (notificationsP.status !== "fulfilled") {
        console.log("failed reading notifications data");
        return;
      }

      all_servers.value = serversP.value;
      all_domains.value = domainsP.value;
      all_notifications.value = notificationsP.value;
    })
    .catch((error) => {
      console.error(error);
      showError('An error occurred', error)
    })
    .finally(() => {
      show_notifications.value = all_notifications.value;
      is_loading.value = false;
    });

const showNotifications = (title_type: string) => {
  if(title_type === 'All' || title_type === '') {
    show_notifications.value = all_notifications.value;
  }
  else if (title_type === 'Tasks'){
    show_notifications.value = all_notifications.value.filter(el => el.task_id);
  }
  else {
    show_notifications.value = all_notifications.value.filter(el => el.major_event_id);
  }
}

const changeStatus = (status) => {
if(status) {
  itemsSelected.value.forEach((item) => {
    item.status = status.status;
    item.updatedAt = (status==0)?null:Date.now();
    console.log(Date());

    apiStore.saveItem("notifications", item.id, item, Notification)
        .then((updatedNotif) => {
          const notification = show_notifications.value.find(el => el.id === item.id);
          notification.status = updatedNotif.status;
          notification.updatedAt = updatedNotif.updatedAt;
        })
        .catch((error) => {
          console.log(error);
        });
  });
}
else {
  return;
}

  itemsSelected.value = [];
  is_saving.value =false;
}

</script>
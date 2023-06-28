<template>
    <template v-if="is_loading">Loading data...</template>
    <template v-else>
      <div>
        Servers
        <div>
          <EasyDataTable
              v-model:server-options="serverOptions"
              :headers="headers"
              :items="all_servers"
              :theme-color="themeColor"
              :search-value="searchValue"
              :loading="is_loading"
              table-class-name="customize-table"
          >
            <template #item-notifications="item">
              <template v-for="notification in all_notifications">
                <div v-if="notification.server_id === item.id && notification.status === 0" class="inline-flex border-red-500 text-red-500">
                  !
                </div>
              </template>
            </template>
            <template #item-createdAt="item">
              <template v-if="item.createdAt">
                <span>{{ item.createdAt.toISOString().split("T")[0] }}</span>
              </template>
            </template>
            <template #item-actions="item">
              <div>
                <button @click="deleteServer(item.id)">
                  <img class="w-6" src="@/assets/img/delete_icon.svg" />
                </button>
                <button @click="openEditServer(item.id)">
                  <img class="w-6" src="@/assets/img/edit_icon1.svg" />
                </button>
              </div>
            </template>
          </EasyDataTable>
        </div>
        <br>
        <button type="submit"
                class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
                @click="add_server = true">Add new server
        </button>
      </div>
      <RightSideBar :show="add_server" @close="add_server = false" title="Add New Server">
        <form @submit.prevent="sendServerData()">
          <input-text v-model="server_data.name" required label="Name"></input-text>
          <input-text v-model="server_data.ip" required label="IP"></input-text>
          <label>
            <p class="font-bold text-[#0A285A] text-xs">Add Server Check:</p>
          </label>
          <Multiselect
              v-model="selected_server_checks"
              :options="all_server_checks.map(el => {return {value:el.id, label:el.name}})"
              mode="tags"
              :close-on-select="false"
              :searchable="true"
          />
          <br>
          <button
              class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
              type="submit">Add Server</button>
        </form>
      </RightSideBar>
      <RightSideBar :show="serverEditId > 0" @close="closeEditServer" title="Edit Server">
        <form @submit.prevent="editServer()">
          <input-text v-model="server_data.name" required label="Name"></input-text>
          <input-text v-model="server_data.ip" required label="IP"></input-text>
          <label>
            <p class="font-bold text-[#0A285A] text-xs">Add Server Check:</p>
          </label>
          <Multiselect
              v-model="selected_server_checks"
              :options="all_server_checks.map(el => {return {value:el.id, label:el.name}})"
              mode="tags"
              :close-on-select="false"
              :searchable="true"
          />
          <br>
          <button
              class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
              type="submit">Edit Server</button>
        </form>
      </RightSideBar>
    </template>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRouter, useRoute} from "vue-router";
import {useApiStore} from "@/stores/api";
import type { Header, Item, ServerOptions } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";
import RightSideBar from "@/components/RightSideBar.vue";
import Multiselect from '@vueform/multiselect';
import Swal from "sweetalert2";
import InputText from "@/components/inputs/InputText.vue";
import {showError, showInfo, showSuccess} from "@/services/ShowMessages";
import {Server, type ServerData} from "@/types/servers";
import {OperationServer, type OperationServerData} from "@/types/operationServer";
import {ServerCheck, ServerCheckData} from "@/types/serverChecks";
import {DomainOperation, DomainOperationData} from "@/types/domainOperations";
import {Notification, NotificationData} from "@/types/notifications";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();
const is_loading = ref(true);
const is_deleting = ref(false);
const add_server = ref(false);
const serverEditId = ref(0);

const themeColor = "#40a48e";
const searchValue = ref("");
const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Name", value: "name", sortable: true },
  { text: "IP", value: "ip", sortable: true },
  { text: "Notifications", value: "notifications", sortable: true },
  { text: "Since", value: "createdAt", sortable: true },
  { text: "Actions", value: "actions", sortable: true },
];
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 25,
  sortBy: "createdAt",
  sortType: "desc",
});

const selected_server_checks = ref([]);
const current_server_operations = ref<OperationServer[]>([]);
const all_server_operations = ref<OperationServer[]>([]);
const all_server_checks = ref<ServerCheck[]>([]);
const all_servers = ref<Server[]>([]);
const all_notifications = ref<Notification[]>([]);
const server_data = ref<Server>({} as Server);
const server_operation_data = ref<OperationServer>({} as OperationServer);

const servers = apiStore.getItems<Server, ServerData>("servers", Server);
const serverChecks = apiStore.getItems<ServerCheck, ServerCheckData>("server-checks", ServerCheck);
const serverOperations = apiStore.getItems<OperationServer, OperationServerData>("operation-servers", OperationServer);
const notifications = apiStore.getItems<Notification, NotificationData>("notifications", Notification);

Promise.allSettled([servers, serverChecks, serverOperations, notifications])
    .then(([serversP, serverChecksP, serverOperationsP, notificationsP]) => {
      if (serversP.status !== "fulfilled") {
        console.log("failed reading domains data");
        return;
      }
      if (serverChecksP.status !== "fulfilled") {
        console.log("failed reading serverChecks data");
        return;
      }
      if (serverOperationsP.status !== "fulfilled") {
        console.log("failed reading serverOperations data");
        return;
      }
      if (notificationsP.status !== "fulfilled") {
        console.log("failed reading notifications data");
        return;
      }

      all_servers.value = serversP.value;
      all_server_checks.value = serverChecksP.value;
      all_server_operations.value = serverOperationsP.value;
      all_notifications.value = notificationsP.value;
    })
    .catch((error) => showError(error,'An error occurred'))
    .finally(() => {
      is_loading.value = false;
    });

const sendServerData = async () => {
  apiStore.createItem<Server, ServerData>("servers", server_data.value, Server)
      .then((_newServer) => {
        all_server_checks.value.forEach((sCheck) => {
          server_operation_data.value.server_id = _newServer.id;
          server_operation_data.value.server_check_id = sCheck.id;
          server_operation_data.value.enabled = selected_server_checks.value.find((el) => el === sCheck.id) ? 1 : 0;

          apiStore.createItem<OperationServer, OperationServerData>("operation-servers", server_operation_data.value, OperationServer)
              .catch((error) => {
                showError(error, 'Server checks were not added, an error occurred!');
              });
        })

        all_servers.value.push(_newServer);
      })
      .catch((error) => showError(error,'Server in question was not created!'))
      .finally(() => {
        server_data.value = {};
        selected_server_checks.value = [];
        add_server.value = false
      });
}

const deleteServer = (current_server_id:number) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      is_deleting.value = true;
      const serverIndex = all_servers.value.findIndex((el) => el.id === current_server_id);
      if (serverIndex >=0 ) {
        all_servers.value.splice(serverIndex, 1);
      }

      apiStore.deleteItem("servers", current_server_id)
          .then(() => showSuccess('Deleted!', 'The server has been deleted.'))
          .catch((error) => showError(error, 'An error has occurred.'))
          .finally(() => is_deleting.value = false)
    }
  })

}

const openEditServer = (current_server_id: number) => {
  server_data.value = all_servers.value.find((el) => el.id === current_server_id);

  current_server_operations.value = all_server_operations.value.filter((el) => (el.server_id === current_server_id) && (el.enabled == true));
  current_server_operations.value.forEach((so) => {
    const ssc = all_server_checks.value.find((sc) => sc.id === so.server_check_id)
    selected_server_checks.value.push(ssc.id)
  });

  serverEditId.value = current_server_id;
}

const editServer = () => {
  apiStore.saveItem<Server, ServerData>("servers", serverEditId.value, server_data.value, Server)
      .then((_updatedServer) => {
        all_server_operations.value
            .filter(el => el.server_id === serverEditId.value)
            .forEach(so => {
              const current_so = selected_server_checks.value.find((sSCheck) =>
                  so.server_check_id === sSCheck
              );
              if (current_so) {
                if (so.enabled === 0) {
                  so.enabled = 1;

                  apiStore.saveItem<OperationServer, OperationServerData>("operation-servers", so.id, so, OperationServer)
                      .catch((error) => {
                        showError(error, 'Domain checks were not added.');
                      })
                }
              } else if (so.enabled === 1) {
                so.enabled = 0;

                apiStore.saveItem<DomainOperation, DomainOperationData>("operation-servers", so.id, so, OperationServer)
                    .catch((error) => {
                      showError(error, 'Domain checks were not added.');
                    })
              }
            })

      })
      .catch((error) => showError(error,'Server in question was not updated!'))
      .finally(() => {
        closeEditServer();
        showSuccess('Succes!', 'The server has been updated.');
      });
}

const closeEditServer = () => {
  serverEditId.value = 0;
  server_data.value = {};
  selected_server_checks.value = [];
}

</script>

<style src="@vueform/multiselect/themes/default.css"></style>

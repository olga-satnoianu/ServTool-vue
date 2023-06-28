<template>
  <template v-if="is_loading === true">Loading data...</template>
  <template v-else>
    <div>
      Domains
      <div>
        <EasyDataTable
            v-model:items="all_domains"
            :headers="headers"
            :theme-color="themeColor"
            :search-value="searchValue"
            :loading="is_loading"
            table-class-name="customize-table"
        >
          <template #item-notifications="item">
            <template v-for="notification in all_notifications">
              <div v-if="notification.domain_id === item.id && notification.status === 0" class="inline-flex border-red-500 text-red-500">
                !
              </div>
            </template>
          </template>
          <template #item-server="item">
            <template v-if="item.server_id">
              <template v-for="server in all_servers">
                <div v-if="server.id === item.server_id">
                  {{ server.name }}
                </div>
              </template>
            </template>
          </template>
          <template #item-createdAt="item">
            <template v-if="item.createdAt">
              <span>{{ item.createdAt.toISOString().split("T")[0] }}</span>
            </template>
          </template>
          <template #item-actions="item">
            <div>
              <button @click="deleteDomain(item.id)">
                <img class="w-6" src="@/assets/img/delete_icon.svg"/>
              </button>
              <button @click="openEditDomain(item.id)">
                <img class="w-6" src="@/assets/img/edit_icon1.svg"/>
              </button>
            </div>
          </template>
        </EasyDataTable>
      </div>
      <br>
      <button type="submit"
              class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
              @click="add_domain = true">Add new domain
      </button>
    </div>
    <RightSideBar :show="add_domain" @close="add_domain = false" title="Add New Domain">
      <form @submit.prevent="sendDomainData()">
        <input-text v-model="domain_data.name" required label="Name"></input-text>
        <input-select
            :options="all_servers"
            v-model="selected_server"
            iterable-key="id"
            property="name"
            label="Server (*optional)"
            scrollable>
        </input-select>
        <label>
          <p class="font-bold text-[#0A285A] text-xs">Add Domain Check:</p>
        </label>
        <Multiselect
            v-model="selected_domain_checks"
            :options="all_domain_checks.map(el => {return {value:el.id, label:el.name}})"
            mode="tags"
            :close-on-select="false"
            :searchable="true"
        />
        <br>
        <button type="submit"
                class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
        >Add Domain</button>
      </form>
    </RightSideBar>
    <RightSideBar :show="domainEditId > 0" @close="closeEditDomain" title="Edit Domain">
      <form @submit.prevent="editDomain()">
        <input-text v-model="domain_data.name" required label="Name"></input-text>
        <input-select
            :options="all_servers"
            v-model="selected_server"
            iterable-key="id"
            property="name"
            label="Server (*optional)"
            scrollable>
        </input-select>
        <label>
          <p class="font-bold text-[#0A285A] text-xs">Add Domain Check:</p>
        </label>
        <Multiselect
            v-model="selected_domain_checks"
            :options="all_domain_checks.map(el => {return {value:el.id, label:el.name}})"
            mode="tags"
            :close-on-select="false"
            :searchable="true"
        />
        <br>
        <button
            class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
            type="submit">Edit Domain</button>
      </form>
    </RightSideBar>

  </template>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRouter, useRoute} from "vue-router";
import {useApiStore} from "@/stores/api";
import type {Header, Item, ServerOptions} from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";
import RightSideBar from "@/components/RightSideBar.vue";
import Multiselect from '@vueform/multiselect';
import {showError, showInfo, showSuccess} from "@/services/ShowMessages";
import {Notification, type NotificationData} from "@/types/notifications";
import {Domain, type DomainData} from "@/types/domains";
import {Server, type ServerData} from "@/types/servers";
import InputText from "@/components/inputs/InputText.vue";
import InputSelect from "@/components/inputs/InputSelect.vue";
import {DomainCheck, type DomainCheckData} from "@/types/domainChecks";
import {DomainOperation, type DomainOperationData} from "@/types/domainOperations";
import Swal from "sweetalert2";
import {OperationServer, OperationServerData} from "@/types/operationServer";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();
const is_loading = ref(true);
const add_domain = ref(false);
const is_deleting = ref(false);
const domainEditId = ref(0);

const themeColor = "#40a48e";
const searchValue = ref("");
const headers: Header[] = [
  {text: "ID", value: "id", sortable: true},
  {text: "Name", value: "name", sortable: true},
  {text: "Server", value: "server", sortable: true},
  {text: "Notifications", value: "notifications", sortable: true},
  {text: "Since", value: "createdAt", sortable: true},
  {text: "Actions", value: "actions", sortable: true},
];
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 25,
  sortBy: "createdAt",
  sortType: "desc",
});

const selected_domain_checks = ref([]);
const all_domain_checks = ref<DomainCheck[]>([]);
const all_notifications = ref<Notification[]>([]);
const all_servers = ref<Server[]>([]);
const selected_server = ref<Server>({} as Server);
const all_domains = ref<Domain[]>([]);
const domain_data = ref<Domain>({} as Domain);
const domain_operation_data = ref<DomainOperation>({} as DomainOperation);
const all_domain_operations = ref<DomainOperation[]>([]);
const current_domain_operations = ref<DomainOperation[]>([]);

const domains = apiStore.getItems<Domain, DomainData>("domains", Domain);
const notifications = apiStore.getItems<Notification, NotificationData>("notifications", Notification);
const servers = apiStore.getItems<Server, ServerData>("servers", Server);
const domainChecks = apiStore.getItems<DomainCheck, DomainCheckData>("domain-checks", DomainCheck);
const domainOperations = apiStore.getItems<DomainOperation, DomainOperationData>("domain-operations", DomainOperation);

Promise.allSettled([domains, notifications, servers, domainChecks, domainOperations])
    .then(([domainsP, notificationsP, serversP, domainChecksP, domainOperationsP]) => {
      if (domainsP.status !== "fulfilled") {
        console.log("failed reading domains data");
        return;
      }
      if (notificationsP.status !== "fulfilled") {
        console.log("failed reading notifications data");
        return;
      }
      if (serversP.status !== "fulfilled") {
        console.log("failed reading servers data");
        return;
      }
      if (domainChecksP.status !== "fulfilled") {
        console.log("failed reading domainChecks data");
        return;
      }
      if (domainOperationsP.status !== "fulfilled") {
        console.log("failed reading domainOperations data");
        return;
      }

      all_domains.value = domainsP.value;
      all_notifications.value = notificationsP.value;
      all_servers.value = serversP.value;
      all_domain_checks.value = domainChecksP.value;
      all_domain_operations.value = domainOperationsP.value;
    })
    .catch((error) => showError(error, 'An error occurred'))
    .finally(() => {
      is_loading.value = false;
    });

const sendDomainData = async () => {
  domain_data.value.server_id = selected_server.value.id;
  await apiStore.createItem<Domain, DomainData>("domains", domain_data.value, Domain)
      .then((_newDomain) => {
        all_domain_checks.value.forEach((dCheck) => {
          domain_operation_data.value.domain_id = _newDomain.id;
          domain_operation_data.value.domain_check_id = dCheck.id;
          domain_operation_data.value.enabled = selected_domain_checks.value.find((el) => el === dCheck.id) ? 1 : 0;

          apiStore.createItem<DomainOperation, DomainOperationData>("domain-operations", domain_operation_data.value, DomainOperation)
              .catch((error) => {
                showError(error, 'Server checks were not added!');
              });
        })

        all_domains.value.push(_newDomain);
      })
      .catch((error) => showError(error, 'Domain in question was not created!'))
      .finally(() => {
        domain_data.value = {};
        selected_domain_checks.value = [];
        selected_server.value = {};
        add_domain.value = false
      });
}

const deleteDomain = (current_domain_id: number) => {
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
      const domainIndex = all_domains.value.findIndex((el) => el.id === current_domain_id);
      if (domainIndex >= 0) {
        all_domains.value.splice(domainIndex, 1);
      }

      apiStore.deleteItem("domains", current_domain_id)
          .then(() => showSuccess('Deleted!', 'The domain has been deleted.'))
          .catch((error) => showError(error, 'An error has occurred.'))
          .finally(() => is_deleting.value = false)
    }
  })

}

const openEditDomain = (current_domain_id: number) => {
  domain_data.value = all_domains.value.find((el) => el.id === current_domain_id);
  selected_server.value = all_servers.value.find((el) => el.id === domain_data.value.server_id);

  current_domain_operations.value = all_domain_operations.value.filter((el) => (el.domain_id === current_domain_id) && (el.enabled == true));
  current_domain_operations.value.forEach((so) => {
    const ssc = all_domain_checks.value.find((sc) => sc.id === so.domain_check_id);
    console.log(all_domain_checks.value)
    selected_domain_checks.value.push(ssc.id);
    console.log(selected_domain_checks);
  });

  domainEditId.value = current_domain_id;
}

const editDomain = () => {
  // debugger;
  domain_data.value.server_id = selected_server.value && selected_server.value.id ? selected_server.value.id : null;
  apiStore.saveItem<Domain, DomainData>("domains", domainEditId.value, domain_data.value, Domain)
      .then((_updatedDomain) => {
            all_domain_operations.value
                .filter(el => el.domain_id == domainEditId.value
                )
                .forEach(so => {
                  const current_so = selected_domain_checks.value.find((sDCheck) =>
                      so.domain_check_id === sDCheck
                  );
                  if (current_so) {
                    if (so.enabled === 0) {
                      so.enabled = 1;

                      apiStore.saveItem<DomainOperation, DomainOperationData>("domain-operations", so.id, so, DomainOperation)
                          .catch((error) => {
                            showError(error, 'Domain checks were not added.');
                          })
                    }
                  } else if (so.enabled === 1) {
                    so.enabled = 0;

                    apiStore.saveItem<DomainOperation, DomainOperationData>("domain-operations", so.id, so, DomainOperation)
                        .catch((error) => {
                          showError(error, 'Domain checks were not added.');
                        })
                  }
                })
          }
      )
      .catch((error) => showError(error, 'Domain in question was not updated!'))
      .finally(() => {
        closeEditDomain();
        showSuccess('Succes!', 'The domain has been updated.');
      });
}

const closeEditDomain = () => {
  domainEditId.value = 0;
  domain_data.value = {};
  selected_domain_checks.value = [];
}

</script>

<style src="@vueform/multiselect/themes/default.css"></style>

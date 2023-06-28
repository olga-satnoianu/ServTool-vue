<template>
  <div>
    <template v-if="is_loading === true">
      Loading data...

    </template>
    <template v-else>
      <div class="font-semibold">
        Automatic Operations
        <br>
        <br>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <p>Domain Operations</p>
            <EasyDataTable
                v-model:items="all_domain_checks"
                :headers="headers"
                :theme-color="themeColor"
                :search-value="searchValue"
                :loading="is_loading"
                table-class-name="customize-table"
            >
              <template #item-actions="item">
                <RouterLink
                    :to="{
                    name: 'operation-details',
                    params: { domain_check_id: item.id },
                  }"
                >
                  <div class="hover:underline text-third">Manage</div>
                </RouterLink>
              </template>
            </EasyDataTable>
          </div>

          <div>
            <p>Server Operations</p>
            <EasyDataTable
                v-model:items="all_server_checks"
                :headers="headers"
                :theme-color="themeColor"
                :search-value="searchValue"
                :loading="is_loading"
                table-class-name="customize-table"
            >
              <template #item-actions="item">
                <RouterLink
                    :to="{
                    name: 'operation-details',
                    params: { server_check_id: item.id },
                  }"
                >
                  <div class="hover:underline text-third">Manage</div>
                </RouterLink>
              </template>
            </EasyDataTable>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRouter, useRoute} from "vue-router";
import {useApiStore} from "@/stores/api";
import type { Header, Item, ServerOptions } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";
import {showError, showInfo, showSuccess} from "@/services/ShowMessages";
import {Domain, type DomainData} from "@/types/domains";
import {DomainCheck, type DomainCheckData} from "@/types/domainChecks";
import {ServerCheck, type ServerCheckData} from "@/types/serverChecks";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();
const is_loading = ref(true);

const themeColor = "#40a48e";
const searchValue = ref("");
const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Name", value: "name", sortable: true },
  // { text: "Actions", value: "actions", sortable: true },
];
// const serverOptions = ref<ServerOptions>({
//   page: 1,
//   rowsPerPage: 25,
//   sortBy: "id",
//   sortType: "asc",
// });

const all_domain_checks = ref<DomainCheck[]>([]);
const all_server_checks = ref<ServerCheck[]>([]);
const all_domains = ref<Domain[]>([]);

const domain_checks = apiStore.getItems<DomainCheck, DomainCheckData>("domain-checks", DomainCheck);
const server_checks = apiStore.getItems<ServerCheck, ServerCheckData>("server-checks", ServerCheck);
const domains = apiStore.getItems<Domain, DomainData>("guides", Domain);

Promise.allSettled([domain_checks, server_checks, domains])
    .then(([domain_checksP, server_checksP, domainsP]) => {
      if (domain_checksP.status !== "fulfilled") {
        console.log("failed reading domain_checks data");
        return;
      }
      if (server_checksP.status !== "fulfilled") {
        console.log("failed reading server_checks data");
        return;
      }
      if (domainsP.status !== "fulfilled") {
        console.log("failed reading domains data");
        return;
      }

      all_domains.value = domainsP.value;
      all_domain_checks.value = domain_checksP.value;
      all_server_checks.value = server_checksP.value;
    })
    .finally(() => {
      console.log(all_domain_checks);
      is_loading.value = false;
    });
</script>
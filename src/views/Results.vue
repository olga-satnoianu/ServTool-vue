<template>
  <div>
    <template v-if="is_loading">
      Loading data...

    </template>
    <template v-else>
      <div>
        Results
        <br>
        <br>
        <div class="flex space-x-12">

          <div class="bg-[#F3F5F9] p-0.5 mb-3 rounded inline-flex space-x-1 mb-10">
          <div class=" font-medium	text-sm px-3	 py-1.5  rounded cursor-pointer"
               :class="[ entityTab === 'domains' ? 'bg-white' : '']"
               @click="entityTab = 'domains'"><p>Domains</p></div>
          <div class=" font-medium	text-sm px-3	 py-1.5  rounded cursor-pointer"
               :class="[ entityTab === 'servers' ? 'bg-white' : '']"
               @click="entityTab = 'servers'"><p>Servers</p></div>
        </div>

          <div class="bg-[#F3F5F9] p-0.5 mb-3 rounded inline-flex space-x-1 mb-10">
            <div class=" font-medium	text-sm px-3	 py-1.5  rounded cursor-pointer"
                 :class="[ typeTab === 'lists' ? 'bg-white' : '']"
                 @click="typeTab = 'lists'"><p>List</p></div>
            <div class=" font-medium	text-sm px-3	 py-1.5  rounded cursor-pointer"
                 :class="[ typeTab === 'graphs' ? 'bg-white' : '']"
                 @click="typeTab = 'graphs'"><p>Graph</p></div>
          </div>

        </div>

        <div v-if="entityTab === 'domains' && typeTab === 'lists'">
          <span>Domain Check Results in the last 7 days</span>
          <div class="grid 2xl:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-4 mt-6">
            <div class="flex flex-col custom-select-country">
              <label for="domain_id">
                <p class="text-sm font-medium">Domain:</p>
              </label>
              <Multiselect
                  v-model="domain_id"
                  mode="tags"
                  :close-on-select="false"
                  :searchable="true"
                  :options="all_domains.map(el => {return {value:el.id, label:el.name}})"
              />
            </div>

            <div class="flex flex-col custom-select-country">
              <label for="domain_check_id">
                <p class="text-sm font-medium">Check:</p>
              </label>
              <Multiselect
                  v-model="domain_check_id"
                  mode="tags"
                  :close-on-select="false"
                  :searchable="true"
                  :options="all_domain_checks.map(el => {return {value:el.id, label:el.name}})"
              />
            </div>

            <div class="flex flex-col custom-select-country">
              <label for="domain_check_status">
                <p class="text-sm font-medium">Status:</p>
              </label>
              <Multiselect
                  v-model="domain_check_status"
                  :options="[
                  { value: 0, label: 'Error' },
                  { value: 1, label: 'Ok' },
                  ]"
                  mode="tags"
                  :close-on-select="false"
              />
            </div>
          </div>

          <EasyDataTable
              v-model:items="all_domain_results"
              :headers="domain_results_headers"
              :theme-color="themeColor"
              :search-value="searchValue"
              :loading="is_loading"
              table-class-name="customize-table"
          >
            <template #item-domain="item">
              <template v-if="item.domain_id">
                <template v-for="domain in all_domains">
                  <div v-if="domain.id === item.domain_id">
                    {{ domain.name }}
                  </div>
                </template>
              </template>
            </template>
            <template #item-check="item">
              <template v-if="item.domain_check_id">
                <template v-for="domain_check in all_domain_checks">
                  <div v-if="domain_check.id === item.domain_check_id">
                    {{ domain_check.name }}
                  </div>
                </template>
              </template>
            </template>
            <template #item-status="item">
              <div v-if="item.status === 1" class="bg-green-50 border-green-500 text-green-500">
                Ok
              </div>
              <div v-else class="bg-red-50 border-red-500 text-red-500">
                Error
              </div>
            </template>
            <template #item-createdAt="item">
              <template v-if="item.createdAt">
                <span>{{
                    item.createdAt.toISOString().split("T")[0]
                  }} {{ item.createdAt.toISOString().split("T")[1].split(".")[0] }}</span>
              </template>
            </template>

          </EasyDataTable>
        </div>

        <div v-else-if="entityTab === 'domains' && typeTab === 'graphs'">
          <!--          <span>Domain Check Results in the last 7 days</span>-->
          <div v-for="domain in all_domains">
            {{domain.name}}
            <div v-if="all_domain_results.length > 0" class="grid 2xl:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-4 mt-6">
              <apexchart
                  type="line"
                  :series="domain_http_results(domain.id)"
                  width="350"
                  height="200"
                  :options="chart_options"
              >
              </apexchart>
              <apexchart
                  type="line"
                  :series="domain_https_results(domain.id)"
                  width="350"
                  height="200"
                  :options="chart_options"
              >
              </apexchart>
              <apexchart
                  type="line"
                  :series="domain_ping_results(domain.id)"
                  width="350"
                  height="200"
                  :options="chart_options"
              >
              </apexchart>
              <apexchart
                  type="line"
                  :series="domain_ssl_results(domain.id)"
                  width="350"
                  height="200"
                  :options="chart_options"
              >
              </apexchart>
            </div>
            <br>
            <br>
            <br>
          </div>
        </div>

        <div v-else-if="entityTab === 'servers' && typeTab === 'lists'">
          <span>Server Check Results in the last 7 days</span>

          <div class="grid 2xl:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-4 mt-6">
            <div class="flex flex-col custom-select-country">
              <label for="server_id">
                <p class="text-sm font-medium">Server:</p>
              </label>
              <Multiselect
                  v-model="server_id"
                  mode="tags"
                  :close-on-select="false"
                  :searchable="true"
                  :options="all_servers.map(el => {return {value:el.id, label:el.name}})"
              />
            </div>

            <div class="flex flex-col custom-select-country">
              <label for="server_check_id">
                <p class="text-sm font-medium">Check:</p>
              </label>
              <Multiselect
                  v-model="server_check_id"
                  mode="tags"
                  :close-on-select="false"
                  :searchable="true"
                  :options="all_server_checks.map(el => {return {value:el.id, label:el.name}})"
              />
            </div>

            <div class="flex flex-col custom-select-country">
              <label for="server_check_status">
                <p class="text-sm font-medium">Status:</p>
              </label>
              <Multiselect
                  v-model="server_check_status"
                  :options="[
                  { value: 0, label: 'Error' },
                  { value: 1, label: 'Ok' },
                  ]"
                  mode="tags"
                  :close-on-select="false"
              />
            </div>
          </div>


          <EasyDataTable
              v-model:items="all_server_results"
              :headers="server_results_headers"
              :theme-color="themeColor"
              :search-value="searchValue"
              :loading="is_loading"
              table-class-name="customize-table"
          >
            <template #item-server="item">
              <template v-if="item.server_id">
                <template v-for="server in all_servers">
                  <div v-if="server.id === item.server_id">
                    {{ server.name }}
                  </div>
                </template>
              </template>
            </template>
            <template #item-check="item">
              <template v-if="item.server_check_id">
                <template v-for="server_check in all_server_checks">
                  <div v-if="server_check.id === item.server_check_id">
                    {{ server_check.name }}
                  </div>
                </template>
              </template>
            </template>
            <template #item-status="item">
              <div v-if="item.status === 1" class="bg-green-50 border-green-500 text-green-500">
                Ok
              </div>
              <div v-else class="bg-red-50 border-red-500 text-red-500">
                Error
              </div>
            </template>
            <template #item-createdAt="item">
              <template v-if="item.createdAt">
                <span>{{
                    item.createdAt.toISOString().split("T")[0]
                  }} {{ item.createdAt.toISOString().split("T")[1].split(".")[0] }}</span>
              </template>
            </template>
          </EasyDataTable>
        </div>

        <div v-else-if="entityTab === 'servers' && typeTab === 'graphs'">
          <!--          <span>Server Check Results in the last 7 days</span>-->
          <div v-for="server in all_servers">
            {{ server.name }}
            <div v-if="all_server_results.length > 0" class="grid 2xl:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-4 mt-6">
              <apexchart
                  type="line"
                  :series="server_80_results(server.id)"
                  width="350"
                  height="200"
                  :options="chart_options"
              >
              </apexchart>
              <apexchart
                  type="line"
                  :series="server_443_results(server.id)"
                  width="350"
                  height="200"
                  :options="chart_options"
              >
              </apexchart>
              <apexchart
                  type="line"
                  :series="server_22_results(server.id)"
                  width="350"
                  height="200"
                  :options="chart_options"
              >
              </apexchart>
              <apexchart
                  type="line"
                  :series="server_ping_results(server.id)"
                  width="350"
                  height="200"
                  :options="chart_options"
              >
              </apexchart>
            </div>
          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import {useRouter, useRoute} from "vue-router";
import {useApiStore} from "@/stores/api";
import type {Header, Item, ServerOptions} from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";
import {ServerCheckResult, type ServerCheckResultData} from "@/types/serverCheckResults";
import {DomainCheckResult, type DomainCheckResultData} from "@/types/domainCheckResults";
import {Domain, type DomainData} from "@/types/domains";
import {Server, type ServerData} from "@/types/servers";
import {DomainOperation} from "@/types/domainOperations";
import Multiselect from '@vueform/multiselect';
import {DomainCheck, type DomainCheckData} from "@/types/domainChecks";
import {ServerCheck, type ServerCheckData} from "@/types/serverChecks";
import type {QueryFilter} from "@/types/QueryFilter";
import {showError} from "@/services/showMessages";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();
const is_loading = ref(true);
const open_filters = ref(false);

const themeColor = "#40a48e";
const searchValue = ref("");
const domain_results_headers: Header[] = [
  {text: "ID", value: "id", sortable: true},
  {text: "Domain", value: "domain", sortable: true},
  {text: "Check", value: "check", sortable: true},
  {text: "Status", value: "status", sortable: true},
  {text: "Check Time", value: "createdAt", sortable: true},
];
const server_results_headers: Header[] = [
  {text: "ID", value: "id", sortable: true},
  {text: "Server", value: "server", sortable: true},
  {text: "Check", value: "check", sortable: true},
  {text: "Status", value: "status", sortable: true},
  {text: "Check Time", value: "createdAt", sortable: true},
];
const entityTab = ref('domains');
const typeTab = ref('lists');

const domain_http_results = computed(() => (domain_id) => {
  const series = [
    {
      name: "HTTP up",
      type: "line",
      data: []
    },
  ];

  all_domain_results.value.forEach(el => {
    if (el.domain_id === domain_id && el.domain_check_id === 2) {
      series[0].data.push({
        x: new Date(el.createdAt),
        y: el.status
      })
    }
  })

  return series;
})

const domain_https_results = computed(() => (domain_id) => {
  const series = [{
    name: "HTTPS up",
    type: "line",
    data: []
  }];

  all_domain_results.value.forEach(el => {
    if (el.domain_id === domain_id && el.domain_check_id === 3) {
      series[0].data.push({
        x: new Date(el.createdAt),
        y: el.status
      })
    }
  })

  return series;
})

const domain_ping_results = computed(() => (domain_id) => {
  const series = [{
    name: "Ping up",
    type: "line",
    data: []
  }];

  all_domain_results.value.forEach(el => {
    if (el.domain_id === domain_id && el.domain_check_id === 1) {
      series[0].data.push({
        x: new Date(el.createdAt),
        y: el.status
      })
    }
  })

  return series;
})

const domain_ssl_results = computed(() => (domain_id) => {
  const series = [{
    name: "SSL up",
    type: "line",
    data: []
  }];

  all_domain_results.value.forEach(el => {
    if (el.domain_id === domain_id && el.domain_check_id === 4) {
      series[0].data.push({
        x: new Date(el.createdAt),
        y: el.status
      })
    }
  })

  return series;
})

const server_80_results = computed(() => (server_id) => {
  const series = [{
    name: "80 up",
    type: "line",
    data: []
  }];

  all_server_results.value.forEach(el => {
    if (el.server_id === server_id && el.server_check_id === 2) {
      series[0].data.push({
        x: new Date(el.createdAt),
        y: el.status
      })
    }
  })

  return series;
})

const server_443_results = computed(() => (server_id) => {
  const series = [{
    name: "443 up",
    type: "line",
    data: []
  }];

  all_server_results.value.forEach(el => {
    if (el.server_id === server_id && el.server_check_id === 3) {
      series[0].data.push({
        x: new Date(el.createdAt),
        y: el.status
      })
    }
  })

  return series;
})

const server_22_results = computed(() => (server_id) => {
  const series = [{
    name: "22 up",
    type: "line",
    data: []
  }];

  all_server_results.value.forEach(el => {
    if (el.server_id === server_id && el.server_check_id === 4) {
      series[0].data.push({
        x: new Date(el.createdAt),
        y: el.status
      })
    }
  })

  return series;
})

const server_ping_results = computed(() => (server_id) => {
  const series = [{
    name: "Ping up",
    type: "line",
    data: []
  }];

  all_server_results.value.forEach(el => {
    if (el.server_id === server_id && el.server_check_id === 1) {
      series[0].data.push({
        x: new Date(el.createdAt),
        y: el.status
      })
    }
  })

  return series;
})


const chart_options = {
  stroke: {
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    tickAmount: 1,
    axisBorder: {
      offsetY: 1.1,
    },
    min:0,
    max:1,
    labels: {
    formatter: (value)  => {
      if(value == 1){
        return "Up";
      }
      else if(value == 0){
        return "Down";
      }
    },
  },
}


  // yaxis: [
  //     {
  //   seriesName: 'Status',
  //       data: [0,1]
  //     },
  //   {
  //     seriesName: 'test',
  //     showForNullSeries: false,
  //     opposite: true
  //   }
  // ],
}

const all_server_results = ref<ServerCheckResult[]>([]);
const all_domain_results = ref<DomainCheckResult[]>([]);
const all_domains = ref<Domain[]>([]);
const all_servers = ref<Server[]>([]);
const all_domain_checks = ref<DomainCheck[]>([]);
const all_server_checks = ref<ServerCheck[]>([]);
const server_id = ref([]);
const domain_id = ref([]);
const server_check_id = ref([]);
const domain_check_id = ref([]);
const domain_check_status = ref([]);
const server_check_status = ref([]);


const loadFromDomainsServer = async () => {
  const loadDomainFilters: QueryFilter[] = [];

  if (domain_id.value.length > 0) {
    const fromDomainFilter: QueryFilter = {
      delimiter: ",",
      field: "domain_id",
      values: domain_id.value
    }
    loadDomainFilters.push(fromDomainFilter);
  }

  if (domain_check_id.value.length > 0) {
    const fromDomainCheckFilter: QueryFilter = {
      delimiter: ",",
      field: "domain_check_id",
      values: domain_check_id.value
    }
    loadDomainFilters.push(fromDomainCheckFilter);
  }

  if (domain_check_status.value.length > 0) {
    const fromDomainCheckStatusFilter: QueryFilter = {
      delimiter: ",",
      field: "domain_check_status",
      values: domain_check_status.value
    }
    loadDomainFilters.push(fromDomainCheckStatusFilter);
  }

  const domainResults = apiStore.getItems<DomainCheckResult, DomainCheckResultData>("domain-check-results", DomainCheckResult, undefined, undefined, loadDomainFilters);
  const Domains = apiStore.getItems<Domain, DomainData>("domains", Domain);
  const servers = apiStore.getItems<Server, ServerData>("servers", Server);
  const domainChecks = apiStore.getItems<DomainCheck, DomainCheckData>("domain-checks", DomainCheck);

  Promise.allSettled([domainResults, Domains, servers, domainChecks])
      .then(([domainResultsP, DomainsP, serversP, domainChecksP]) => {
        if (domainResultsP.status !== "fulfilled") {
          console.log("failed reading domainResults data");
          return;
        }
        if (DomainsP.status !== "fulfilled") {
          console.log("failed reading Domains data");
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

        all_domain_results.value = domainResultsP.value;
        all_domains.value = DomainsP.value;
        all_servers.value = serversP.value;
        all_domain_checks.value = domainChecksP.value;
        // domain_check_meta_filters.value = apiStore.meta.filters;

        console.log(domain_http_results.value(8), all_domain_results.value)
      })
      .catch((error) => showError(error, 'An error occurred'))
      .finally(() => {
        is_loading.value = false;
      });
}

const loadFromServersServer = async () => {
  const loadServerFilters: QueryFilter[] = [];

  if (server_id.value.length > 0) {
    const fromServerFilter: QueryFilter = {
      delimiter: ",",
      field: "server_id",
      values: server_id.value
    }
    loadServerFilters.push(fromServerFilter);
  }

  if (server_check_id.value.length > 0) {
    const fromServerCheckFilter: QueryFilter = {
      delimiter: ",",
      field: "server_check_id",
      values: server_check_id.value
    }
    loadServerFilters.push(fromServerCheckFilter);
  }

  if (server_check_status.value.length > 0) {
    const fromServerCheckStatusFilter: QueryFilter = {
      delimiter: ",",
      field: "server_check_status",
      values: server_check_status.value
    }
    loadServerFilters.push(fromServerCheckStatusFilter);
  }

  const serverResults = apiStore.getItems<ServerCheckResult, ServerCheckResultData>("server-check-results", ServerCheckResult, undefined, undefined, loadServerFilters);
  const servers = apiStore.getItems<Server, ServerData>("servers", Server);
  const serverChecks = apiStore.getItems<ServerCheck, ServerCheckData>("server-checks", ServerCheck);

  Promise.allSettled([serverResults, servers, serverChecks])
      .then(([serverResultsP, serversP, serverChecksP]) => {
        if (serverResultsP.status !== "fulfilled") {
          console.log("failed reading serverResults data");
          return;
        }
        if (serversP.status !== "fulfilled") {
          console.log("failed reading servers data");
          return;
        }
        if (serverChecksP.status !== "fulfilled") {
          console.log("failed reading serverChecks data");
          return;
        }

        all_server_results.value = serverResultsP.value;
        all_servers.value = serversP.value;
        all_server_checks.value = serverChecksP.value;
        // server_check_meta_filters.value = apiStore.meta.filters;
      })
      .catch((error) => showError(error, 'An error occurred'))
      .finally(() => {
        is_loading.value = false;
      });
}


watch(domain_id, (value) => {
  loadFromDomainsServer();
});
watch(domain_check_id, (value) => {
  loadFromDomainsServer();
});
watch(domain_check_status, (value) => {
  loadFromDomainsServer();
});
loadFromDomainsServer();


watch(server_id, (value) => {
  loadFromServersServer();
});
watch(server_check_id, (value) => {
  loadFromServersServer();
});
watch(server_check_status, (value) => {
  loadFromServersServer();
});
loadFromServersServer();


const clearServerFilters = () => {
  server_id.value = [];
  server_check_id.value = []
}
const clearDomainFilters = () => {
  server_id.value = [];
  server_check_id.value = []
}

const server_filters_not_empty = computed(() => {
  if ((server_id.value.length !== 0) || (server_check_id.value.length !== 0)
  ) {
    return true;
  } else {
    return false;
  }
})


const domain_filters_not_empty = computed(() => {
  if ((server_id.value.length !== 0) || (server_check_id.value.length !== 0)
  ) {
    return true;
  } else {
    return false;
  }
})


</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<template>
  <div v-if="isLoading">Loading data ...</div>
  <div v-else>
    <div class=" max-w-[1200px] mx-auto flex mt-6 justify-between">
      <p class="text-lg lg:text-2xl font-semibold">Projects</p>

      <div class="w-full flex space-x-3 justify-end">
        <DateRangeSelector
            label="Period:"
            v-model:type="data_livrare"
            v-model:range="data_range_eta"
        ></DateRangeSelector>
        <div class="w-1/3">
          <label>
            <p class="text-text  font-medium">Status:</p>
          </label>
          <Multiselect
              v-model="selectedStatus"
              :options="[
                  { value: 'All', label: 'All' },
                  { value: 'on_hold', label: ' On Hold' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'stuck', label: 'Stuck' },
                  { value: 'done', label: ' Done' },]
"
          />
        </div>
      </div>
    </div>


    <div :class="authStore.user?.roles[0].name=== 'admin' ? 'bg-indigo-50' : 'bg-purple-100' "
         class=" mt-10   max-w-[1200px] mx-auto shadow-softxl">
      <div
          class="w-full mb-1 py-2 xl:flex text-primary text-sm font-bold hidden border-indigo-200 border xl:flex text-primary text-md font-bold ">
        <div class="w-[33%] text-center">Project</div>
        <div class="w-[33%] text-center">Name</div>
        <div class="w-[33%] text-center">Member</div>
        <div class="w-[33%] text-center">Status</div>
      </div>
      <div>
        <div v-for="active_task in active_tasks">
          <div
              :class="authStore.user?.roles[0].name=== 'admin' ? 'border-indigo-200 hover:bg-blue-50' : 'border-purple-200 hover:bg-purple-50' "
              class="flex flex-row w-full bg-white py-2.5 border-b border-l border-r">
            <div class="w-[33%] text-center font-semibold">{{ computedProject(active_task.project_id) }}
            </div>
            <div class="w-[33%] text-center font-semibold">{{ active_task.task_name }}
            </div>
            <div class="w-[33%] text-center font-semibold">{{ computedTeamMember(active_task.team_id) }}
            </div>
            <div class="w-[33%] text-center font-semibold">{{ active_task.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ActiveTask, type ActiveTaskData} from "@/types/ActiveTasks";
import {useApiStore} from "@/stores/api";
import {computed, ref, watch} from "vue";
import {useAuthStore} from "@/stores/auth";
import {useDateFilterStore} from "@/stores/dateFilter";
import {Team, type TeamData} from "@/types/Teams";
import {Project, type ProjectData} from "@/types/Projects";
import Multiselect from '@vueform/multiselect';
import {QueryFilter} from "@/types/QueryFilter";
import DateRangeSelector from "@/components/inputs/DateRangeSelector.vue";
import {DateFilterHelper} from "@/helpers/DateFilterHelper";

const api = useApiStore();
const isLoading = ref(true);
const selectedStatus = ref("All");
const active_tasks = ref<ActiveTask[]>([]);
const authStore = useAuthStore();
const team_list = ref<Team[]>([]);
const project_list = ref<Project[]>([]);
const dateFilterStore = useDateFilterStore();
const data_livrare = ref<string | null>(null);
const data_range_eta = ref<Array<Date> | null>(null);

api.getItems<Team, TeamData>('teams', Team)
    .then((teamList) => {
      team_list.value = teamList;
      isLoading.value = false;
    })
api.getItems<Project, ProjectData>('projects', Project)
    .then((projectList) => {
      project_list.value = projectList;
      isLoading.value = false;
    })
const computedTeamMember = computed(() => (active_task_member_id: number) => {
  const member = team_list.value.find(el => el.id === active_task_member_id);
  if (member === undefined) {
    return null;
  }
  return member.name;
});
const computedProject = computed(() => (project_id: number) => {
  const project = project_list.value.find(el => el.id === project_id);
  if (project === undefined) {
    return null;
  }
  return project.name;
});

const loadFromServer = async () => {
  const loadFilters: QueryFilter[] = [];

  if (data_range_eta.value !== null) {
    data_range_eta.value[0].setHours(0, 0, 0, 0);
    data_range_eta.value[1].setHours(23, 59, 59, 999);
    const from = DateFilterHelper.FormatAsDateTimeString(data_range_eta.value[0]);
    const to = DateFilterHelper.FormatAsDateTimeString(data_range_eta.value[1]);
    const dataLivrareFilter: QueryFilter = {
      delimiter: null,
      field: "updated_at",
      values: [`${from},${to}`]
    }

    loadFilters.push(dataLivrareFilter);
  }

  if (selectedStatus.value !== 'All' ) {
    const statusFilter: QueryFilter = {
      delimiter: null,
      field: "status",
      values: [selectedStatus.value]
    }

    loadFilters.push(statusFilter);
  }

  api.getItems<ActiveTask, ActiveTaskData>('active-tasks', ActiveTask, undefined, undefined, loadFilters)
      .then((activeTasksList) => {
        active_tasks.value = activeTasksList;
        isLoading.value = false;
      })
};

watch(data_range_eta, (value) => {
  loadFromServer();
});
loadFromServer();


</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>
.vue3-easy-data-table__header th {
  color: #6c7293 !important;
  text-transform: capitalize;
}

.vue3-easy-data-table__main.hoverable tr td {
  color: #6c7293 !important;
  font-size: 13px;
}

.vue3-easy-data-table {
  border: none !important;
  padding: 20px;
  background: white;
  font-size: 13px;
}

.vue3-easy-data-table__header th .header {
  text-align: left;
  font-size: 14px !important;
  font-weight: 500 !important;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.filters-section input[type=text] {
  height: 35px !important;
}

.multiselect {
  height: 35px !important;
  min-height: 30px !important;
}

.filters-section .multiselect .multiselect-tags-search {
  height: inherit !important;
}

.vue3-easy-data-table__body td {
  font-weight: 400 !important;
  font-size: 12px !important;
}

.dots-loader:not(:required) {
  opacity: 1;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -4px;
  margin-top: -4px;
  text-indent: -9999px;
  display: inline-block;
  width: 8px;
  height: 8px;
  background: transparent;
  border-radius: 100%;
  box-shadow: #f86 -14px -14px 0 7px, #fc6 14px -14px 0 7px,
  #6d7 14px 14px 0 7px, #4ae -14px 14px 0 7px;
  animation: dots-loader 5s infinite ease-in-out;
  transform-origin: 50% 50%;
  transform: scale(1);
  transition: 0.3s all;
}

@keyframes dots-loader {
  0% {
    box-shadow: #03409D -14px -14px 0 7px, #03409D 14px -14px 0 7px,
    #03409D 14px 14px 0 7px, #03409D -14px 14px 0 7px;
  }
  8.33% {
    box-shadow: #03409D 14px -14px 0 7px, #03409D 14px -14px 0 7px,
    #03409D 14px 14px 0 7px, #03409D -14px 14px 0 7px;
  }
  16.67% {
    box-shadow: #03409D 14px 14px 0 7px, #03409D 14px 14px 0 7px, #03409D 14px 14px 0 7px,
    #03409D -14px 14px 0 7px;
  }
  25% {
    box-shadow: #03409D -14px 14px 0 7px, #03409D -14px 14px 0 7px,
    #03409D -14px 14px 0 7px, #03409D -14px 14px 0 7px;
  }
  33.33% {
    box-shadow: #03409D -14px -14px 0 7px, #03409D -14px 14px 0 7px,
    #03409D -14px -14px 0 7px, #03409D -14px -14px 0 7px;
  }
  41.67% {
    box-shadow: #03409D 14px -14px 0 7px, #03409D -14px 14px 0 7px,
    #03409D -14px -14px 0 7px, #03409D 14px -14px 0 7px;
  }
  50% {
    box-shadow: #03409D 14px 14px 0 7px, #03409D -14px 14px 0 7px,
    #03409D -14px -14px 0 7px, #03409D 14px -14px 0 7px;
  }
  58.33% {
    box-shadow: #03409D -14px 14px 0 7px, #03409D -14px 14px 0 7px,
    #03409D -14px -14px 0 7px, #03409D 14px -14px 0 7px;
  }
  66.67% {
    box-shadow: #03409D -14px -14px 0 7px, #03409D -14px -14px 0 7px,
    #03409D -14px -14px 0 7px, #03409D 14px -14px 0 7px;
  }
  75% {
    box-shadow: #03409D 14px -14px 0 7px, #03409D 14px -14px 0 7px,
    #03409D 14px -14px 0 7px, #03409D 14px -14px 0 7px;
  }
  83.33% {
    box-shadow: #03409D 14px 14px 0 7px, #03409D 14px -14px 0 7px,
    #03409D 14px 14px 0 7px, #03409D 14px 14px 0 7px;
  }
  91.67% {
    box-shadow: #03409D -14px 14px 0 7px, #03409D 14px -14px 0 7px,
    #03409D 14px 14px 0 7px, #03409D -14px 14px 0 7px;
  }
  100% {
    box-shadow: #03409D -14px -14px 0 7px, #03409D 14px -14px 0 7px,
    #03409D 14px 14px 0 7px, #03409D -14px 14px 0 7px;
  }
}

.loaded .dots-loader {
  opacity: 0;
  z-index: -1;
  pointer-events: none;
  transform: scale(0);
}
</style>
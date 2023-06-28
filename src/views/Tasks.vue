<template>
    <template v-if="is_loading === true">
      Loading data...

    </template>
    <template v-else>
      <div>
        Available tasks
        <div>
          <EasyDataTable
              v-model:items="all_tasks"
              :headers="headers"
              :theme-color="themeColor"
              :search-value="searchValue"
              :loading="is_loading"
              table-class-name="customize-table"
          >
            <template #item-cicle="item">
              <template v-if="item.time_cicle && item.time_unit">
                {{item.time_cicle}} {{item.time_unit}}
              </template>
            </template>
            <template #item-actions="item">
              <div>
                <button @click="deleteServer(item.id)">
                  <img class="w-6" src="@/assets/img/delete_icon.svg" />
                </button>
                <button @click="openEditTask(item.id)">
                  <img class="w-6" src="@/assets/img/edit_icon1.svg" />
                </button>
              </div>
            </template>
          </EasyDataTable>
          <br>
          <button type="submit"
                  class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
                  @click="add_task = true">Add new task
          </button>
        </div>
        <RightSideBar :show="add_task" @close="add_task = false" title="Add New Task">
          <form @submit.prevent="sendTaskData()">
            <input-text v-model="task_data.title" required label="Title"></input-text>
            <input-textarea v-model="task_data.description" label="Description"></input-textarea>
            <input-number v-model="task_data.time_cicle" label="Time cicle"></input-number>
            <input-select-primitives
                :options="time_units"
                v-model="task_data.time_unit"
                label="Time unit"
            >
            </input-select-primitives>
            <br>
            <button
                class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
                type="submit">Add Task</button>
          </form>
        </RightSideBar>
        <RightSideBar :show="taskEditId > 0" @close="closeEditTask" title="Edit Task">
          <form @submit.prevent="editTask()">
            <input-text v-model="task_data.title" required label="Title"></input-text>
            <input-textarea v-model="task_data.description" label="Description"></input-textarea>
            <input-number v-model="task_data.time_cicle" label="Time cicle"></input-number>
            <input-select-primitives
                :options="time_units"
                v-model="task_data.time_unit"
                label="Time unit"
            >
            </input-select-primitives>
            <br>
            <button
                class="max-w-md w-full py-3 border border-blue-400 text-md font-semibold text-blue-500 hover:text-white hover:bg-blue-400 rounded-full"
                type="submit">Edit Task</button>
          </form>
        </RightSideBar>
      </div>
    </template>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {useRouter, useRoute} from "vue-router";
import {useApiStore} from "@/stores/api";
import type { Header, Item, ServerOptions } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";
import RightSideBar from "@/components/RightSideBar.vue";
import {showError, showInfo, showSuccess} from "@/services/ShowMessages";
import {Task, type TaskData} from "@/types/tasks";
import Swal from "sweetalert2";
import InputTextarea from "@/components/inputs/InputTextarea.vue";
import InputNumber from "@/components/inputs/InputNumber.vue";
import InputSelectPrimitives from "@/components/inputs/InputSelectPrimitives.vue";
import InputText from "@/components/inputs/InputText.vue";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();
const is_loading = ref(true);
const is_deleting = ref(false);
const add_task = ref(false);
const taskEditId = ref(0);
const time_units = [
    'Days',
    'Weeks',
    'Months',
    'Years'
];

const themeColor = "#40a48e";
const searchValue = ref("");
const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Title", value: "title", sortable: true },
  { text: "Description", value: "description", sortable: true },
  { text: "Cicle", value: "cicle", sortable: true },
  { text: "Actions", value: "actions", sortable: true },
];

const all_tasks = ref<Task[]>([]);
const task_data = ref<Task>({} as Task);

apiStore.getItems<Task, TaskData>("tasks", Task)
    .then((response) => {
      all_tasks.value = response;
    })
    .finally(() => is_loading.value = false)

const sendTaskData = async () => {
  apiStore.createItem<Task, TaskData>("tasks", task_data.value, Task)
      .then((_newTask) => {
        all_tasks.value.push(_newTask);
      })
      .catch((error) => showError(error,'Task in question was not created!'))
      .finally(() => {
        task_data.value = {};
        add_task.value = false
      });
}

const deleteServer = (current_task_id:number) => {
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
      apiStore.deleteItem("tasks", current_task_id)
          .then(() => showSuccess('Deleted!', 'The server has been deleted.'))
          .catch((error) => showError(error, 'An error has occurred.'))
          .finally(() => {
            const taskIndex = all_tasks.value.findIndex((el) => el.id === current_task_id);
            if (taskIndex >=0 ) {
              all_tasks.value.splice(taskIndex, 1);
            }

            is_deleting.value = false;
          })
    }
  })

}

const openEditTask = (current_task_id: number) => {
  task_data.value = all_tasks.value.find((el) => el.id === current_task_id);
  taskEditId.value = current_task_id;
}

const editTask = () => {
  apiStore.saveItem<Task, TaskData>("tasks", taskEditId.value, task_data.value, Task)
      .catch((error) => showError(error,'Task in question was not updated!'))
      .finally(() => {
        closeEditTask();
        showSuccess('Succes!', 'The task has been updated.');
      });
}

const closeEditTask = () => {
  taskEditId.value = 0;
  task_data.value = {};
}
</script>
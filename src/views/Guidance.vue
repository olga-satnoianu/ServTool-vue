<template>
  <div>
    <template v-if="is_loading === true">
      Loading data...

    </template>
    <template v-else>
      <div>
        Guidance
          <input-select
              @click="showGuide(major_event.id)"
              :options="all_major_events"
              v-model="major_event.id"
              iterable-key="id"
              property="title"
              label="Select Major Event"
              scrollable>
          </input-select>
        <br>
        <div>
          <EasyDataTable
              v-model:items="show_guides"
              :headers="headers"
              :theme-color="themeColor"
              :search-value="searchValue"
              :loading="is_loading"
              table-class-name="customize-table"
          >
            <template #item-major_event="item">
              <template v-for="event in all_major_events">
                <div v-if="event.id === item.major_event_id">
                  {{ event.title }}
                </div>
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
import type { Header, Item, ServerOptions } from "vue3-easy-data-table";
import EasyDataTable from "vue3-easy-data-table";
import InputSelect from "@/components/inputs/InputSelect.vue";
import {showError, showInfo, showSuccess} from "@/services/ShowMessages";
import {MajorEvent, type MajorEventData} from "@/types/majorEvents";
import {Guide, type GuideData} from "@/types/guides";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();
const is_loading = ref(true);

const themeColor = "#40a48e";
const searchValue = ref("");
const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Title", value: "title", sortable: true },
  { text: "Description", value: "description", sortable: true },
  { text: "Major Event", value: "major_event", sortable: true },
];
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 25,
  sortBy: "id",
  sortType: "asc",
});

const major_event = ref<MajorEvent>({} as MajorEvent);
const all_major_events = ref<MajorEvent[]>([]);
const all_guides = ref<Guide[]>([]);
const show_guides = ref<Guide[]>([]);

const guides = apiStore.getItems<Guide, GuideData>("guides", Guide);
const majorEvents = apiStore.getItems<MajorEvent, MajorEventData>("major-events", MajorEvent);

Promise.allSettled([guides, majorEvents])
    .then(([guidesP, majorEventsP]) => {
      if (guidesP.status !== "fulfilled") {
        console.log("failed reading guides data");
        return;
      }
      if (majorEventsP.status !== "fulfilled") {
        console.log("failed reading major_events data");
        return;
      }

      all_guides.value = guidesP.value;
      all_major_events.value = majorEventsP.value;
    })
    .finally(() => {
      show_guides.value = all_guides.value;
      is_loading.value = false;
    });

const showGuide = (major_event_id) => {
  if(major_event_id) {
    show_guides.value = all_guides.value.filter(el => el.major_event_id == major_event_id.id);
  }
  else {
    show_guides.value = all_guides.value;
  }
}
</script>
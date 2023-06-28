<template>
  <div>
    <template v-if="is_loading === true">
      Loading data...

    </template>
    <template v-else>
      <div>
        Automatic Operation {{operation_id}}.
        <div>
          EDIT OPTIONS
          <button>
            Add new domain for this automatic operation.
          </button>

          <form @submit.prevent="editOperation()">
            <div>
              <label>
                <p>Deactivate for domains:</p>
              </label>
              <Multiselect
                  v-model="selected_domains"
                  :options="operation_domains"
                  mode="tags"
                  :close-on-select="false"
                  :searchable="true"
              />
            </div>
            <div>
              <label>
                <p class="text-primary font-medium">Change cicle:</p>
              </label>
              <Multiselect
                  v-model="op_domain"
                  :options="op_domains"
                  mode="tags"
                  :close-on-select="false"
                  :searchable="true"
              />
              <input-number
                v-model="dom_op.time_cicle"
                label="Time cicle">
              </input-number>
              <input-select-primitives
                v-model="dom_op.time_unit"
                :options="time_units"
                label="Time unit"
                scrollable="true">
              </input-select-primitives>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApiStore } from "@/stores/api";
import {Operation, type OperationData} from "@/types/operations";
import {Domain, type DomainData} from "@/types/domains";
import {DomainOperation, type DomainOperationData} from "@/types/domainOperations";
import {showError} from "@/services/showMessages";
import InputSelect from "@/components/inputs/InputSelect.vue";
import Multiselect from '@vueform/multiselect';
import InputText from "@/components/inputs/InputText.vue";
import InputNumber from "@/components/inputs/InputNumber.vue";
import InputSelectPrimitives from "@/components/inputs/InputSelectPrimitives.vue";

const apiStore = useApiStore();
const route = useRoute();
const router = useRouter();
const is_loading = ref(true);
const update_details = ref(false);

const operation_id = parseInt(route.params.operation_id as string);
const operation = ref<Operation>({} as Operation);
const all_domains = ref<Domain[]>([]);
const operation_domains = ref<Domain[]>([]);
const selected_domains = ref<Domain[]>([]);
const time_units = [
    'ms',
    's',
    'min',
    'h',
    'd',
    'm',
    'y',
];

const op = apiStore.getItem<Operation, OperationData>("operations", operation_id, Operation, "domains");
const doms = apiStore.getItems<Domain, DomainData>("domains", Domain, "operations");
const dom_ops = apiStore.getItems<DomainOperation, DomainOperationData>("domains", DomainOperation);

Promise.allSettled([op, doms, dom_ops])
    .then(([opP, domsP, dom_opsP]) => {
        if (opP.status !== "fulfilled") {
          console.log("failed reading operation data");
          return;
        }
        if (domsP.status !== "fulfilled") {
          console.log("failed reading domains data");
          return;
        }
        if (dom_opsP.status !== "fulfilled") {
          console.log("failed reading domain-operations data");
          return;
        }

        operation.value = opP.value;
        all_domains.value = domsP.value;
    })
    .catch((error) => showError('An error occurred', error))
    .finally(() => is_loading.value = false);

const editOperation = () => {

}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

import {defineStore} from "pinia";
import JSONAPISerializer from "json-api-serializer";
import type {JSONAPIDocument} from "json-api-serializer";
import type {AxiosRequestConfig} from "axios";
import axios from "axios";
import {ref} from "vue";
import type {QueryFilter} from "@/types/QueryFilter";
import {showError} from "@/services/ShowMessages";
import pluralize from "pluralize";
import type {JsonApiPagination} from "@/types/JsonApiPagination";

export const useApiStore = defineStore("api", () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const configApi: AxiosRequestConfig = {
        baseURL: `${BASE_URL}/api/v1`,
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
        }
    };

    const axiosApi = ref(axios.create(configApi));

    const configAuth: AxiosRequestConfig = {
        baseURL: `${BASE_URL}/api`,
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
        }
    };

    const axiosAuth = ref(axios.create(configAuth));

    const Serializer = new JSONAPISerializer();

    const meta = ref<Object|undefined>();

    const json_api_types = [
        {type: 'users', schema: {}},
        {
            type: 'notifications', schema: {
                relationships: {
                    domain: {
                        type: "domains"
                    },
                    task: {
                        type: "tasks"
                    },
                    majorEvent: {
                        type: "major-events"
                    },
                }
            }
        },
        {
            type: 'guides', schema: {
                relationships: {
                    majorEvent: {
                        type: "major-events"
                    },
                }
            }
        },
        {
            type: 'major-events', schema: {
                relationships: {
                    guide: {
                        type: "guides-events"
                    },
                }
            }
        },
        {type: 'tasks', schema: {}},
        {
            type: 'domains', schema: {
                relationships: {
                    notifications: {
                        type: "notifications"
                    },
                }
            }
        },
        {type: 'domain-checks', schema: {}},
        {type: 'domain-operations', schema: {}},
        {type: 'domain-check-results', schema: {}},
        {type: 'servers', schema: {}},
        {type: 'server-checks', schema: {}},
        {type: 'operation-servers', schema: {}},
        {type: 'server-check-results', schema: {}},

    ]

    json_api_types.forEach(typeData => {
        Serializer.register(typeData.type, {
            ...typeData.schema,
            afterDeserialize: (data: any) => {
                data.id = parseInt(data.id);
                return data;
            },
        });
    });

    const jsonApiSerialize = <T>(type: string, data: T): JSONAPIDocument => {
        return Serializer.serialize(type, data);
    }

    const jsonApiDeserialize = <T>(type: string, data: JSONAPIDocument): T => {
        return Serializer.deserialize(type, data);
    }

    const jsonApiSerializeRelationToOne = <T>(type: string, data: Object): JSONAPIDocument => {
        return {
            data: {
                type: type,
                id: data.id.toString()
            }
        };
    }

    const jsonApiSerializeRelationToMany = <T>(type: string, data: Array<Object>): JSONAPIDocument => {
        const relationData = [];
        data.forEach(el => {
            relationData.push({
                type: type,
                id: el.id.toString(),
            })
        })
        return {
            data: relationData
        };
    }

    function getItems<T, DT>(
        schema: string,
        type: { new(data: DT): T },
        relations: string | string[] | undefined = undefined,
        fields: { [key: string]: Array<string> } | undefined = undefined,
        filters: Array<QueryFilter> | undefined = undefined,
        pagination: JsonApiPagination | undefined = undefined,
        sort: string | string[] | undefined = undefined,
    ): Promise<T[]> {
        return new Promise((resolve, reject) => {
            let jsonApiUrl = `/${schema}`;
            let queryParams: Array<string> = [];

            if (relations !== undefined) {
                if (typeof relations === 'string') {
                    queryParams.push(`include=${relations}`);
                } else if (Array.isArray(relations)) {
                    queryParams.push(`include=${relations.join(',')}`);
                }
            }
            if (fields !== undefined) {
                Object.keys(fields).forEach(relationName => {
                    queryParams.push(`fields[${relationName}]=${fields[relationName].join(',')}`);
                })
            }

            if (Array.isArray(filters)) {
                filters.forEach(filter => {
                    if (filter.delimiter === null || filter.delimiter === undefined) {
                        filter.values.forEach(filter_value => {
                            queryParams.push(`filter[${filter.field}]=${filter_value}`)
                        })
                    } else {
                        queryParams.push(`filter[${filter.field}]=${filter.values.join(filter.delimiter)}`)
                    }
                })
            }

            if (pagination !== undefined) {
                queryParams.push(`page[number]=${pagination.page_number}`);
                queryParams.push(`page[size]=${pagination.page_size}`);
            }

            if (sort !== undefined) {
                if (typeof sort === 'string') {
                    queryParams.push(`sort=${sort}`);
                } else if (Array.isArray(sort)) {
                    queryParams.push(`sort=${sort.join(',')}`);
                }
            }

            if (queryParams.length > 0) {
                jsonApiUrl += `?${queryParams.join('&')}`;
            }

            axiosApi.value.get(jsonApiUrl)
                .then((response) => {
                    const data_items: DT[] = jsonApiDeserialize<DT[]>(schema, response.data);
                    const items: T[] = [];
                    data_items.forEach(el => items.push(new type(el)));
                    if(response.data.meta)
                    {
                        meta.value = response.data.meta;
                    }
                    else
                    {
                        meta.value = undefined;
                    }
                    resolve(items);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Update ${pluralize(type.name)} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function getItem<T, DT>(schema: string, id: number, type: {
        new(data: DT): T
    }, relations: string | string[] | undefined = undefined): Promise<T> {
        return new Promise((resolve, reject) => {
            let jsonApiUrl = `/${schema}/${id}`;
            if (relations !== undefined) {
                if (typeof relations === 'string') {
                    jsonApiUrl += `?include=${relations}`;
                } else if (Array.isArray(relations)) {
                    jsonApiUrl += `?include=${relations.join(',')}`;
                }
            }
            axiosApi.value.get(jsonApiUrl)
                .then((response) => {
                    const data_item: DT = jsonApiDeserialize<DT>(schema, response.data as JSONAPIDocument);
                    const item: T = new type(data_item);
                    resolve(item);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Get ${type.name} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function createItem<T, DT>(schema: string, data: T, type: { new(data: DT): T }, extra: null|any): Promise<T> {
        let extra_headers = {};

        if(extra){
            extra_headers = extra;
        }

        return new Promise((resolve, reject) => {
            const payload: JSONAPIDocument = jsonApiSerialize<T>(schema, data);
            axiosApi.value.post(`/${schema}`, payload,{
                headers: extra_headers
            })
                .then((response) => {
                    const data: DT = jsonApiDeserialize<DT>(schema, response.data as JSONAPIDocument);
                    const item: T = new type(data);
                    resolve(item);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Create ${type.name} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function saveItem<T, DT>(schema: string, id: number, data: T | any, type: { new(data: DT): T }): Promise<T> {
        return new Promise((resolve, reject) => {
            const payload: JSONAPIDocument = jsonApiSerialize<T>(schema, data);
            axiosApi.value.patch(`/${schema}/${id}`, payload)
                .then((response) => {
                    const data: DT = jsonApiDeserialize<DT>(schema, response.data as JSONAPIDocument);
                    const item: T = new type(data);
                    resolve(item);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Update ${type.name} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function deleteItem(schema: string, id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            axiosApi.value.delete(`/${schema}/${id}`)
                .then((response) => {
                    resolve();
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Delete error`, message)
                    reject("An error has occured");
                })
        });
    }

    function relationDeleteItem<T, DT>(schema: string, relationship: string, parent_id: number, related_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const payload = {
                data: [
                    {
                        type: relationship,
                        id: related_id.toString()
                    }
                ]
            };
            let jsonApiUrl = `/${schema}/${parent_id}/relationships/${relationship}`;
            axiosApi.value.delete(jsonApiUrl, {data: payload})
                .then((response) => {
                    resolve();
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Delete error`, message)
                    reject("An error has occured");
                })
        });
    }

    function relationAddItem<T, DT>(schema: string, relationship: string, parent_id: number, data: any, type: {
        new(data: DT): T
    }): Promise<T> {
        return new Promise((resolve, reject) => {
            const payload: JSONAPIDocument = jsonApiSerializeRelationToOne<T>(relationship, data);
            let jsonApiUrl = `/${schema}/${parent_id}/relationships/${relationship}`;
            axiosApi.value.post(jsonApiUrl, payload)
                .then((response) => {
                    const data: DT = jsonApiDeserialize<DT>(schema, response.data as JSONAPIDocument);
                    const item: T = new type(data);
                    resolve(item);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Add ${type.name} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function relationAddItems<T, DT>(schema: string, relationship: string, parent_id: number, data: any, type: {
        new(data: DT): T
    }): Promise<T> {
        return new Promise((resolve, reject) => {
            const payload: JSONAPIDocument = jsonApiSerializeRelationToMany<T>(relationship, data);
            let jsonApiUrl = `/${schema}/${parent_id}/relationships/${relationship}`;
            axiosApi.value.post(jsonApiUrl, payload)
                .then((response) => {
                    const data: DT = jsonApiDeserialize<DT>(schema, response.data as JSONAPIDocument);
                    const item: T = new type(data);
                    resolve(item);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Add ${pluralize(type.name)} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function relationReplaceItem<T, DT>(schema: string, relationship: string, parent_id: number, data: any, type: {
        new(data: DT): T
    }): Promise<T> {
        return new Promise((resolve, reject) => {
            const payload: JSONAPIDocument = jsonApiSerializeRelationToOne<T>(relationship, data);
            let jsonApiUrl = `/${schema}/${parent_id}/relationships/${relationship}`;
            axiosApi.value.patch(jsonApiUrl, payload)
                .then((response) => {
                    const data: DT = jsonApiDeserialize<DT>(schema, response.data as JSONAPIDocument);
                    const item: T = new type(data);
                    resolve(item);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Replace ${type.name} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function relationReplaceItems<T, DT>(schema: string, relationship: string, parent_id: number, data: any, type: {
        new(data: DT): T
    }): Promise<T> {
        return new Promise((resolve, reject) => {
            const payload: JSONAPIDocument = jsonApiSerializeRelationToMany<T>(relationship, data);
            let jsonApiUrl = `/${schema}/${parent_id}/relationships/${relationship}`;
            axiosApi.value.patch(jsonApiUrl, payload)
                .then((response) => {
                    const data: DT = jsonApiDeserialize<DT>(schema, response.data as JSONAPIDocument);
                    const item: T = new type(data);
                    resolve(item);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Replace ${pluralize(type.name)} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function relationGetItem<T, DT>(schema: string, relationship: string, parent_id: number, type: {
        new(data: DT): T
    }): Promise<T> {
        return new Promise((resolve, reject) => {
            let jsonApiUrl = `/${schema}/${parent_id}/relationships/${relationship}`;
            axiosApi.value.get(jsonApiUrl)
                .then((response) => {
                    const data_item: DT = jsonApiDeserialize<DT>(schema, response.data as JSONAPIDocument);
                    const item: T = new type(data_item);
                    resolve(item);
                })
                .catch((error) => {
                    let message = "";
                    if (error.response?.data?.errors?.length > 0) {
                        error.response.data.errors.forEach(err => {
                            message += err.detail + "<br>"
                        })
                    }
                    showError(`Get ${type.name} error`, message)
                    reject("An error has occured");
                })
        });
    }

    function relationGetItems<T, DT>(schema: string, relationship: string, parent_id: number, type: {
        new(data: DT): T
    }): Promise<T[]> {
        return new Promise((resolve, reject) => {
            let jsonApiUrl = `/${schema}/${parent_id}/relationships/${relationship}`;
            axiosApi.value.get(jsonApiUrl)
                .then((response) => {
                    const data_items: DT[] = jsonApiDeserialize<DT[]>(relationship, response.data as JSONAPIDocument);
                    const items: T[] = [];
                    data_items.forEach(el => items.push(new type(el)));
                    resolve(items);
                })
                .catch((error) => {
                    let message = "";
                    if (error.errors?.length) {
                        error.errors.forEach((err: string) => {
                            message += err + "<br>"
                        })
                    }
                    console.log(error)
                    showError("Update company error", message)
                    reject("An error has occured");
                })
        });
    }

    return {
        BASE_URL,
        axiosApi,
        axiosAuth,
        jsonApiSerialize,
        jsonApiDeserialize,
        meta,
        getItems,
        getItem,
        createItem,
        saveItem,
        relationDeleteItem,
        deleteItem,
        relationAddItem,
        relationAddItems,
        relationReplaceItem,
        relationReplaceItems,
        relationGetItem,
        relationGetItems,
    };
});

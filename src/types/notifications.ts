import type {HasRelations} from "@/types/common"; //implements HasRelations
import {MajorEvent} from "@/types/majorEvents";
import {Task} from "@/types/tasks";

export class Notification{
    public id:number;
    public domain_id:number|null;
    public server_id:number|null;
    public task_id:number|null;
    public major_event_id:number|null;
    public title: string|null;
    public description:string|null;
    public importance:string|null;
    public status:boolean;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:NotificationData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.domain_id = 0;
            this.server_id = 0;
            this.task_id = 0;
            this.major_event_id = 0;
            this.title = '';
            this.description = '';
            this.importance = '';
            this.status = false;
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.domain_id = data.domain_id;
            this.server_id = data.server_id;
            this.task_id = data.task_id;
            this.major_event_id = data.major_event_id;
            this.title = data.title;
            this.description = data.description;
            this.importance = data.importance;
            this.status = data.status;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type NotificationData = {
    id:number;
    domain_id:number|null;
    server_id:number|null;
    task_id:number|null;
    major_event_id:number|null;
    title:string|null;
    description:string|null;
    importance:string|null;
    status:boolean;
    createdAt:Date|null;
    updatedAt:Date|null;

}
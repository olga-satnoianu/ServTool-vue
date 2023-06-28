import type {HasRelations} from "@/types/common"; //implements HasRelations

export class MajorEvent{
    public id:number;
    public guide_id:number|null;
    public title:string;
    public description:string|null;
    public trigger_reason:string|null;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:MajorEventData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.guide_id = null;
            this.title = '';
            this.description = '';
            this.trigger_reason = '';
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.guide_id = data.guide_id;
            this.title = data.title;
            this.description = data.description;
            this.trigger_reason = data.trigger_reason;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type MajorEventData = {
    id:number;
    guide_id:number|null
    title:string;
    description:string|null;
    trigger_reason:string|null;
    createdAt:Date|null;
    updatedAt:Date|null;

}
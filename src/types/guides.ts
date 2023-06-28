import type {HasRelations} from "@/types/common"; //implements HasRelations

export class Guide{
    public id:number;
    public major_event_id:number;
    public title:string;
    public description:string;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:GuideData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.major_event_id = 0;
            this.title = '';
            this.description = '';
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.major_event_id = data.major_event_id;
            this.title = data.title;
            this.description = data.description;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type GuideData = {
    id:number;
    major_event_id:number;
    title:string;
    description:string;
    createdAt:Date|null;
    updatedAt:Date|null;

}
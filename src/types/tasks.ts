import type {HasRelations} from "@/types/common"; //implements HasRelations

export class Task{
    public id:number;
    public title:string;
    public description:string|null;
    public time_cicle:number|null;
    public time_unit:string|null;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:TaskData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.title = '';
            this.description = '';
            this.time_cicle = 0;
            this.time_unit = '';
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.title = data.title;
            this.description = data.description;
            this.time_cicle = data.time_cicle;
            this.time_unit = data.time_unit;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type TaskData = {
    id:number;
    title:string;
    description:string|null;
    time_cicle:number|null;
    time_unit:string|null;
    createdAt:Date|null;
    updatedAt:Date|null;
}
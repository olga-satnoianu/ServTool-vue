import type {HasRelations} from "@/types/common"; //implements HasRelations

export class Domain{
    public id:number;
    // public user_id:number;
    public name:string;
    public server_id:number|null;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:DomainData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            // this.user_id = 0;
            this.name = '';
            this.server_id = 0;
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            // this.user_id = data.user_id;
            this.name = data.name;
            this.server_id = data.server_id;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type DomainData = {
    id:number;
    // user_id:number;
    name:string;
    server_id:number|null;
    createdAt:Date|null;
    updatedAt:Date|null;

}
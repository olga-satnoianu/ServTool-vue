// import type {HasRelations} from "@/types/common";

export class DomainOperation{
    public id:number;
    public domain_id:number;
    public domain_check_id:number;
    public enabled:boolean;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:DomainOperationData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.domain_id = 0;
            this.domain_check_id = 0;
            this.enabled = false;
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.domain_id = data.domain_id;
            this.domain_check_id = data.domain_check_id;
            this.enabled = data.enabled;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type DomainOperationData = {
    id:number;
    domain_id:number;
    domain_check_id:number;
    enabled:boolean;
    createdAt:Date|null;
    updatedAt:Date|null;

}
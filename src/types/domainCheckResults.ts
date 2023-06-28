export class DomainCheckResult{
    public id:number;
    public domain_id:number;
    public domain_check_id:number;
    public status:number;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:DomainCheckResultData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.domain_id = 0;
            this.domain_check_id = 0;
            this.status = 0;
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.domain_id = data.domain_id;
            this.domain_check_id = data.domain_check_id;
            this.status = data.status;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type DomainCheckResultData = {
    id:number;
    domain_id:number;
    domain_check_id:number;
    status:number;
    createdAt:Date|null;
    updatedAt:Date|null;

}
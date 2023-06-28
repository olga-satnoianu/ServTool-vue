export class ServerCheckResult{
    public id:number;
    public server_id:number;
    public server_check_id:number;
    public status:number;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:ServerCheckResultData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.server_id = 0;
            this.server_check_id = 0;
            this.status = 0;
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.server_id = data.server_id;
            this.server_check_id = data.server_check_id;
            this.status = data.status;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type ServerCheckResultData = {
    id:number;
    server_id:number;
    server_check_id:number;
    status:number;
    createdAt:Date|null;
    updatedAt:Date|null;

}
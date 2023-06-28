export class OperationServer{
    public id:number;
    public server_id:number;
    public server_check_id:number;
    public enabled:boolean;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:OperationServerData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.server_id = 0;
            this.server_check_id = 0;
            this.enabled = false;
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.server_id = data.server_id;
            this.server_check_id = data.server_check_id;
            this.enabled = data.enabled;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type OperationServerData = {
    id:number;
    server_id:number;
    server_check_id:number;
    enabled:boolean;
    createdAt:Date|null;
    updatedAt:Date|null;

}
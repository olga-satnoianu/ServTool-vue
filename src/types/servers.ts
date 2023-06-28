export class Server{
    public id:number;
    public ip:string;
    public name:string;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:ServerData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.ip = '';
            this.name = '';
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.ip = data.ip;
            this.name = data.name;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type ServerData = {
    id:number;
    ip:string;
    name:string;
    createdAt:Date|null;
    updatedAt:Date|null;

}
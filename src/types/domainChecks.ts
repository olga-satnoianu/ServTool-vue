export class DomainCheck{
    public id:number;
    public name:string;
    public createdAt:Date|null;
    public updatedAt:Date|null;

    public constructor(data:DomainCheckData|undefined = undefined)
    {
        if(data === undefined)
        {
            this.id = 0;
            this.name = '';
            this.createdAt = null;
            this.updatedAt = null;
        }
        else
        {
            this.id = data.id;
            this.name = data.name;
            this.createdAt = data.createdAt?new Date(data.createdAt):null;
            this.updatedAt = data.updatedAt?new Date(data.updatedAt):null;
        }
    }
}

export type DomainCheckData = {
    id:number;
    name:string;
    createdAt:Date|null;
    updatedAt:Date|null;

}
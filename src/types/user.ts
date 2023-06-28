export class User {
    public id: number;
    public first_name: string;
    public last_name: string;
    public email: string;
    public password: string|null;

    constructor(data: UserData | undefined = undefined) {
        if (data === undefined) {
            this.id = 0;
            this.first_name = "";
            this.last_name = "";
            this.email = "";
            this.password = "";

        } else {
            this.id = data.id;
            this.first_name = data.first_name;
            this.last_name = data.last_name;
            this.email = data.email;
            this.password = data.password;
        }
    }


    public getFullName()
    {
        return `${this.first_name} ${this.last_name}`;
    }

    public getInitials(glue?:boolean):string|Array<string> {
        if (typeof glue === "undefined") {
            glue = true;
        }

        let full_name = this.getFullName();

        const initials = full_name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

        if(initials === null)
        {
            if (glue) {
                return "";
            } else {
                return [];
            }
        }

        if (glue) {
            return initials.join('');
        }

        return  initials;
    };

}


export type UserData = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password:string|null;
}

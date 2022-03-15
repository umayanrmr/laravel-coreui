import { BSColor } from "../../enum/bscolor.enum";


export class Alert {
    id: string;
    color: BSColor;
    message: string;
    
    constructor(obj?: any) {
        this.id = obj && obj.id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.color = obj && obj.color || BSColor.Success;
        this.message = obj && obj.message || null;
    }
}


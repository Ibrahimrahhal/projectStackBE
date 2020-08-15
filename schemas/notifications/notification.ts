import { GenerateRandomID } from '../../util';


export default abstract class Notification{
    ID:string;
    read:boolean;
    
    constructor(ID:string){
        ID = ID || GenerateRandomID();
    }
    markAsRead():void{
        this.read = true;
    }

    isRead():boolean{
        return this.read;
    }
}
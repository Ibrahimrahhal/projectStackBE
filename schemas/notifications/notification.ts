import Serializable from '../../implementables/serializations';
import { GenerateRandomID } from '../../util';


export default abstract class Notification implements Serializable{
    ID:string;
    read:boolean;
    UserID:string;
    timestamp:number;
    constructor(ID:string, UserID:string, read:boolean = false){
        this.read = read;
        this.UserID = UserID;
        ID = ID || GenerateRandomID();
    }

    markAsRead():void{
        this.read = true;
    }

    isRead():boolean{
        return this.read;
    }

    serializeAsJSON(){
        let obj:any = {};
        Object.keys(this).forEach((key)=>{
            if(typeof (this as any)[key] != typeof undefined)
                obj[key] = (this as any)[key];
        });
        return obj; 
    }
}
import Serializable from "../../implementables/serializations";

export default abstract class JoinRequest implements Serializable{
    ID:string;
    userID:string;
    projectID:string;
    message:string;
    accepted:boolean;
    rejected:boolean;
    rejectionMessage:string;
    acceptionMessage:string;
    timestamp:number;

    constructor(){
        this.timestamp = Date.now();
    }
    
    isOnHold():boolean{
        return (typeof this.accepted == typeof undefined) || (typeof this.rejected == typeof undefined);
    }

    isAccepted():boolean{
        return this.accepted === true;
    }

    isRejected():boolean{
        return this.rejected === false;
    }

    
    serializeAsJSON(){
        let obj:any = {};
        Object.keys(this).forEach((key)=>{
            if(typeof (this as any)[key] != typeof undefined)
                obj[key] = (this as any)[key];
        });
        return obj; 
    }

    abstract markAsAccepted: markWithMithMultipleUsers | markWithMithSingleUsers;

    abstract markAsRejected: markWithMithMultipleUsers | markWithMithSingleUsers;
}


type markWithMithMultipleUsers = (UserIDThatRejected:string, message:string)=>void;
type markWithMithSingleUsers = (message:string)=>void;
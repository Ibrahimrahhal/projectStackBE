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
    public type:number;

    constructor(
        ID:string, 
        userID:string, 
        projectID:string, 
        message:string = "", 
        accepted:boolean = false, 
        rejected:boolean = false, 
        rejectionMessage:string = "",
        acceptionMessage:string = "",
        timestamp:number = Date.now()){
        
        this.ID = ID;
        this.userID = userID;
        this.projectID = projectID;
        this.message = message;
        this.accepted = accepted;
        this.rejected = rejected;
        this.rejectionMessage = rejectionMessage;
        this.acceptionMessage = acceptionMessage;
        this.timestamp = timestamp;
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

    isUserJoinRequest():boolean{
        return this.type === JoinRequestTypeEnum.UserJoinRequest
    }

    isProjectJoinRequest():boolean{
        return this.type === JoinRequestTypeEnum.ProjectJoinRequest;
    }

    abstract markAsAccepted: markWithMithMultipleUsers | markWithMithSingleUsers;

    abstract markAsRejected: markWithMithMultipleUsers | markWithMithSingleUsers;
}


type markWithMithMultipleUsers = (UserIDThatRejected:string, message:string)=>void;
type markWithMithSingleUsers = (message:string)=>void;

export const JoinRequestTypeEnum = {
    ProjectJoinRequest:1,
    UserJoinRequest:2
}
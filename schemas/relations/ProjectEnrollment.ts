import { hashFunction } from "../../util";
import Serializable from "../../implementables/serializations";
import Deserializable from "../../implementables/deserialization";

export default class ProjectUserRelations implements Serializable{

    private ID:string;
    private userID:string;
    private projectId:string;
    private timestamp:number;
    private isAdmin:boolean;
    constructor(projectId:string, userID:string, isAdmin:boolean = false, ID?:string, timestamp?:number){
        this.projectId = projectId;
        this.userID = userID;
        this.ID = ID ||  hashFunction(projectId+userID);
        this.timestamp = timestamp || Date.now();
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
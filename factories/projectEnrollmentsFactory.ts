import ProjectEnrollment from "../schemas/relations/ProjectEnrollment";
import Factory from "./factory";

export default class ProjectEnrollmentFactory extends Factory<ProjectEnrollment>{


    public createItem(json:any):ProjectEnrollment{
        return this.FromJSON(json);
    }

    public createItemParams(userID:string, projectId:string, isAdmin:boolean = false):ProjectEnrollment{
        return this.FromJSON({userID, projectId, isAdmin});
    }

    private FromJSON({ID, userID, projectId, isAdmin, timestamp}:any):ProjectEnrollment{
        return new ProjectEnrollment( projectId, userID, isAdmin, ID, timestamp);
    }

    
}
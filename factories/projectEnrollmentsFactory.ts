import ProjectEnrollment from "../schemas/relations/ProjectEnrollment";
import Factory from "./factory";

export default class ProjectEnrollmentFactory extends Factory<ProjectEnrollment>{


    createItem(json:any):ProjectEnrollment{
        return this.FromJSON(json);
    }

    private FromJSON({ID, userID, projectId, isAdmin, timestamp}:any):ProjectEnrollment{
        return new ProjectEnrollment(userID, projectId, isAdmin, ID, timestamp);
    }

    
}
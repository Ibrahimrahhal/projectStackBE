import ProjectEnrollment from "../schemas/relations/ProjectEnrollment";
import Factory from "./factory";

export default class ProjectEnrollmentFactory extends Factory<ProjectEnrollment>{
    createItem(json:any):ProjectEnrollment{
        return this.FromJSON(json);
    }

    private FromJSON({ID, userID, projectId, timestamp}:any):ProjectEnrollment{
        return new ProjectEnrollment(ID, userID, projectId, timestamp);
    }
}
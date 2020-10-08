import Project from "../schemas/project/project";

export interface ProjectWithExtras{
    project:Project;
    extras:{
        isAdmin:boolean
    }
}
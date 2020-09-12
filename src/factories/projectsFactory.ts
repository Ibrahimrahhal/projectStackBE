import Project from '../schemas/project/project';
import Factory from './factory';

export default class ProjectsFactory extends Factory<Project>{
    createItem(projectObject:any):Project{
        return new Project(projectObject);
    }
}


import DynamodbController from "../dynamodbController";

export default abstract class ManyToMany<RelationClass, FirstEntity, SecondEntity> extends DynamodbController<RelationClass>{
    protected abstract FirstEntityController:DynamodbController<FirstEntity>;
    protected abstract SecondEntityController:DynamodbController<SecondEntity>;


    public async AddRelation(Item:RelationClass):Promise<void>{
        super.patchItem(Item);
    }


    public async getAllRelationByFirstEntity(FirstEntityKey:string){

    }

    public async getAllRelationBySecondEntity(SecondEntityKey:string){

    }

}
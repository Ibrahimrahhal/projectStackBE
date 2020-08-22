import Config from '../../config';

export default class ElasticsearchController{


public static async PutItem(indexName:string, Item:any){

}

public static async PatchItem(indexName:string, Item:any){

}


public static async search(indexName:string, SearchObject:any){

}


private getElasticSearchEndPoint():string{
    return Config.elasicsearch;
}


}
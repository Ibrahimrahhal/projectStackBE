import Config from '../../config';
import { Client } from '@elastic/elasticsearch';
import Bodybuilder from 'bodybuilder';
import Serializable from '../../implementables/serializations';

export default class ElasticsearchController{

private static elasticsearchInstance:Client = new Client({ node: ElasticsearchController.getElasticSearchEndPoint() })

private constructor(){
}

public static insertItem(indexName:string, Item:any, ID:string = Item.ID){
    return this.elasticsearchInstance.index({
        index: indexName,
        body: Item,
        id:ID
      });
}

public static GetItem(indexName:string, ID:string){
    return this.elasticsearchInstance.get({
        index: indexName,
        id: ID
      });
}

public static PatchItem(indexName:string, Item: any, ID:string = Item.ID){

    return this.elasticsearchInstance.update({
        index: indexName,
        id: ID,
        body: {
          script:{
            source: this.generateUpdateScript(Item),
            lang: "painless",
            params : Item
          }
        }
      })
}


public static search(indexName:string, SearchObject:any, page:number){
    return this.elasticsearchInstance.search({
        index: indexName,
        from: page?(page * Config.elasticsearch.searchPageSize):undefined,
        size: page?Config.elasticsearch.searchPageSize:undefined,
        body: this.generateQuery(SearchObject)    
    });
}


private static getElasticSearchEndPoint():string{
    return Config.elasticsearch.endpoint;
}

private static generateUpdateScript(Item:any){
    let script = "";
    Object.keys(Item).forEach((key)=>{
        script+= `ctx._source.${key} = params.${key};`;
    });
    return script;
}

private static generateQuery(SearchObject:any){
    let query = Bodybuilder();

    (SearchObject['filter'] || []).forEach((q:any)=>{
        query = query.filter(q.type, q.feild, q.value);
    });

   return query.build();
}


}
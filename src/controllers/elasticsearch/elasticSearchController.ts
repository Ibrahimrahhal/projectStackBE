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
        from: (typeof page === typeof 1)?(page * Config.elasticsearch.searchPageSize):0,
        size: (typeof page === typeof 1)?Config.elasticsearch.searchPageSize:999,
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
    (SearchObject['matchers'] || []).forEach((q:any, index:number)=>{
        // if(index == 0)
        //     query = query.query(q.type, q.feild, q.value);
        // else
            query = query.orQuery(q.type, q.feild, q.value);

    });
    (SearchObject['filters'] || []).forEach((q:any)=>{
        if(q.value instanceof Array){
            q.value.forEach((val:any)=>{
                query = query.orFilter(q.type, q.feild, val);
            })
        }else{
            query = query.filter(q.type, q.feild, q.value);
        }
    });
    (SearchObject['exists'] || []).forEach((q:any)=>{
            query = query.query('exists', q);
    });

    (SearchObject['sort'] || []).forEach((q:any)=>{
        query = query.sort(q.feild, q.order || 'desc');
    });
    (SearchObject['not'] || []).forEach((q:any)=>{
        query = query.notFilter('match', q.feild, q.value);
});
    let result = query.build();
    if(Object.keys(result).length == 0)
        result = Bodybuilder()
        .query('match_all')
        .build();

    console.log(JSON.stringify(result))
   return result;
}


}
export default interface elasticsearchResponse<T>{
    hits?:{
        hits:Array<{
            _id: string,
            _index: string,
            _score: number,
            _source: T,
            _type: string
        }>,
        max_score:number,
        total:{
            value:number,
            relation:string
        }
    }
}

export interface elasticsearchSingleResponse<T>{
    found:boolean;
    _id:string;
    _index:string;
    _primary_term:number;
    _seq_no:number;
    _source:T
    _type:string
    _version:number
}

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

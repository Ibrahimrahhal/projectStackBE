export interface Searchable<T>{
    Search:(SearchObject:any)=>Promise<{results:T[], pages:number}>;
}
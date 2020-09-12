export interface Searchable<T>{
    Search:(SearchObject:any)=>Promise<T>;
}
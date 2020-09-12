export default interface Deserializable<T>{
    FromJSON:(JSON:any)=>T;
}
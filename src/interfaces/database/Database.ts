export interface DatabaseInterface {
    createOrLoadDatabase:()=>void;
    databaseLoaded:boolean;
    setDatabaseLoaded:(status:boolean)=>void;
    emptyDatabase:()=>void;
    singleFileRemove:(uniqueId : string)=>void;
}
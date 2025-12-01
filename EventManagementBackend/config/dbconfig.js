import mongoose from "mongoose";
import DB_NAME from "./db_name.js";

const instance = async()=>{
    try{
    const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Database is connected ", connect.connection.host, connect.connection.name);
    }
    catch(error){
        console.log("Database is not connected", error);
        process.exit(1);
    }
}
export default instance;
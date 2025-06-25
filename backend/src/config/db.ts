import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB =async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    }
    catch(err){
        console.error("Database connection error:", err);
        process.exit(1); // Exit the process with failure   
    }
}

export default connectDB;
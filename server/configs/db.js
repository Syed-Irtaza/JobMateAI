import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        mongoose.connection.on("connected",()=>{console.log("database connected successfully")});
        let mongodbURI=process.env.MONGODB_URI;
        const projectName="JOBMATEAI";
        if(!mongodbURI){
            throw new Error("MONGOOSE_URI environment variable is not set")
        }
        if(mongodbURI.endsWith('/')){
            mongodbURI=mongodbURI.slice(0,-1) 
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`)
          
    } catch (error) {
        console.error("Error connecting to Mongo DB",error);
        
    }
}

export default connectDB;  
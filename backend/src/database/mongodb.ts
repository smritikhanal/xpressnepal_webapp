import mongoose from "mongoose";

export async function connectDatabase(){
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xpressnepal',{});
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Database Error:", error);
        process.exit(1); 
    }
}
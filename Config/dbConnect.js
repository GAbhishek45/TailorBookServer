import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
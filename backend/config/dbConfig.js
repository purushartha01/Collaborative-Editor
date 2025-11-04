import mongoose from "mongoose";
import { MONGODB_URL } from "./serverConfig.js";

export const connectToDB = async () => {
    return mongoose.connect(MONGODB_URL);
}

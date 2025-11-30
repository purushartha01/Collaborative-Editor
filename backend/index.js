import morgan from "morgan";
import express from "express";
import cors from "cors";

import { connectToDB } from "./config/dbConfig.js";
import { PORTNO } from "./config/serverConfig.js";
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from './routes/documentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

app.use(morgan("dev"));

app.use((req, res, next) => {
    console.log(`${req.method} request received for ${req.url}`);
    next();
});

// TODO: Uncomment the below lines to enable CORS
// app.use(cors({
//     origin: "http://localhost:5173 || *",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/api/auth", userRoutes);
app.use("/v1/api/documents", documentRoutes);
app.use("/v1/api/ai", aiRoutes)


connectToDB().then(() => {
    console.log("Connected to the database");
    app.listen(PORTNO, () => {
        console.log(`Server is running on port ${PORTNO}`);
    })
}).catch((err) => {
    console.log("Error connecting to the database", err);
});
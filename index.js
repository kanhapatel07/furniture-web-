import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import routes from "./routes/route.js";
import { dbConnection } from "./config/db.js";

dotenv.config();

const app = express();


// CORS
app.use(cors());


// JSON
app.use(express.json());


// FORM DATA
app.use(express.urlencoded({
    extended: true
}));


// Public folder
app.use(express.static("public"));


// Product images
app.use(
    "/uploads",
    express.static(
        path.join(process.cwd(), "uploads")
    )
);


// API
app.use("/api", routes);


// Database
dbConnection();


// Server
app.listen(process.env.PORT, () => {

    console.log(
        `Server running on port ${process.env.PORT}`
    );

});

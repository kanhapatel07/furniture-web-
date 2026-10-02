
import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hotel_db"
});

export const dbConnection = () => {

    db.connect((err) => {

        if (err) {
            console.log("Database connection failed:", err.message);
            console.log(err);
            return;
        }

        console.log("Database connected");
    });

};

export default db;


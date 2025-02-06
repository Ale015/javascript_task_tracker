import dotenv from "dotenv";
import mssql from "mssql";

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
};

async function connectDB() {
    try {
        const pool = await mssql.connect(dbConfig);
        console.log("Conectado ao SQL Server!");
        return pool;
    } catch (err) {
        console.error("Erro ao conectar com o banco de dados:", err);
    }
}

export { connectDB };

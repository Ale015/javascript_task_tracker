import dotenv from "dotenv";
import mssql from "mssql";

dotenv.config();


// Verificação das variáveis de ambiente
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_DATABASE || !process.env.DB_PORT) {
    console.error("Erro: Variáveis de ambiente faltando!");
    process.exit(1); // Para garantir que o código pare aqui se faltar alguma variável
}


const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT,10),
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

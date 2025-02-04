import {connectDB} from "./db.js";
import dotenv from "dotenv"
import express from "express";


import taskRoutes from "./routes/taskRoutes.js"


import { createTask } from "./models/taskModel.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", taskRoutes)

connectDB();

const task = createTask("Teste", "Essa é uma tarefa de teste", "Not Started").then(newTask => {console.log("Tarefa criada: ", newTask)});






const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta: ${PORT}`)
})
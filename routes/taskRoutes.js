import express from "express";
import { createTask } from "../models/taskModel.js";

const router = express.Router();

// Rota = Criação de Tarefas 

router.post("/tasks", async (req,res) =>{
    try {
        const {title, description, status} = req.body;

        const newTask = await createTask(title, description, status)

        res.status(201).json({ message: "Tarefa criada com sucesso.", task: newTask})
    } catch (error) {
        
        res.status(500).json({error: "Erro ao criar tarefa: ", details})
    }
});



export default router;
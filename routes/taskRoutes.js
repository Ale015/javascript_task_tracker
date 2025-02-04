import express from "express";
import { createTask } from "../models/taskModel.js";

import mssql from "mssql";


const router = express.Router();

// ROTAS
// GET (Todas as Tarefas)
router.get("/tasks", async (req, res) => {

    const query = `
        SELECT * FROM dbo.Tasks
    `;

    async function retrieveData(){
        const pool = await mssql.connect();
        const result = await pool.query(query);
        return result.recordset;
    }

    try {
        
        const tasks = await retrieveData();
        res.status(200).json(tasks)
        
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        res.status(500).json({ error: "Erro ao buscar tarefas." });
    }


    
})



// GET (Tarefa por ID)
router.get("/tasks/:id", async (req,res)=>{

    const {id} = req.params;

    const query = `SELECT * FROM dbo.tasks WHERE id = @id`;

    try {
        const pool = await mssql.connect();
        const result = await pool.request()
            .input("id", mssql.Int, id)
            .query(query);

        if(result.recordset.length === 0){
            return res.status(404).json({message: "Tarefa não encontrada."})
        };


        res.status(200).json(result.recordset[0]);

    } catch (error) {
        console.error("Erro ao buscar tarefa por ID:", error);
        res.status(500).json({message: "Erro ao buscar tarefa."});
    }



})

// GET (Todas as Tarefas Filtradas por Status) -> Parâmetro: Status
// POST (Nova Tarefa) -> Parâmetro: title, description, status
// PUT (Editar Tarefa já existente) -> Parâmetro: ID e body com atualização
// PUT (Editar Status Tarefa) -> Parâmetro: ID e Status
// DELETE (Deletar Tarefa) -> Parâmetro: ID





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
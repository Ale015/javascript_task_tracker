import express, { query } from "express";
import { createTask } from "../models/taskModel.js";

import mssql from "mssql";


const router = express.Router();




const allowedStatuses = ["not_started","in_progress", "completed"]

// ROTAS

// POST (Nova Tarefa) -> Parâmetro: title, description, status
router.post("/tasks", async (req,res) =>{
    const {title, description, status} = req.body;

    const formattedStatus = status.toLowerCase().replace(/\s+/g, "_");


    if(!allowedStatuses.includes(formattedStatus)){
        return res.status(400).json({ message: "Status inválido. Use: not_started, in_progress ou completed." });
    }

    try {
        const result = await createTask(title, description, formattedStatus);
        res.status(201).json(result); // Garantindo o retorno da criação
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// GET (Todas as Tarefas)
// GET (Todas as Tarefas Filtradas por Status) -> Parâmetro: Status
router.get("/tasks", async (req, res) => {
    let { status } = req.query;

    let query = `SELECT * FROM dbo.Tasks`

    let request = null;

    try {
       const pool = await mssql.connect();
       request = pool.request();
       
        if(status){
            const statusArray = status.split(",").map(s => s.trim().toLowerCase().replace(/\s+/g, "_"));
            const allowedStatuses  = ["not_started", "in_progress", "completed"];
            const validStatuses = statusArray.filter(s => allowedStatuses.includes(s));

            if(validStatuses.length === 0){
                return res.status(400).json({message: "Nenhum status válido encontrado. Use: not_started, in_progress, complete"})
            }

            const placeholders = validStatuses.map( (value ,index) => `@status${index}`).join(", ");
            query += ` WHERE status IN (${placeholders})`;

            validStatuses.forEach((value, index) => {
                request.input(`status${index}`, mssql.NVarChar, value);
            })
        }

        const result  = await request.query(query) 

        if(result.recordset.length === 0){
            return res.status(400).json({message: "Nenhum status válido encontrado. Use: not_started, in_progress, completed."})
        }

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Erro ao buscar tarefas:", error.message);
        res.status(500).json({ message: "Erro ao buscar tarefas." });
    }
    
});




// GET (Tarefa por ID)
router.get("/tasks/:id", async (req,res)=>{

    const {id} = req.params;

    const query = `SELECT * FROM dbo.Tasks WHERE id = @id`;

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


// PUT (Editar Tarefa já existente) -> Parâmetro: ID e body com atualização
router.put("/tasks/:id", async (req, res) => {
    const {id} = req.params;
    const updates = req.body;

    if(!id){
        return res.status(400).json({ message: "ID da tarefa é obrigatório." })
    }

    if(Object.keys(updates).length === 0){
        return res.status(400).json({message: "Nenhuma atualização fornecida."})
    }

    const allowedFields = ["title","description","status"]
    const updateFields = Object.keys(updates).filter(field => allowedFields.includes(field));

    if(updateFields.length === 0){
        return res.status(400).json({message: "Campos inválidos para atualização."})
    }

    const querySet = updateFields.map(field => `${field} = @${field}`).join(", ")

    const query = `
        UPDATE dbo.Tasks SET ${querySet} WHERE id = @id;
    `

    try {
        
        const pool = await mssql.connect();
        const request = await pool.request();

        request.input("id", mssql.Int, id);
        updateFields.forEach(field => request.input(field, mssql.NVarChar, updates[field]))

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0){
            return res.status(404).json({message: "Tarefa não encontrada."})
        }

        res.status(200).json({ message: `Tarefa de ID ${id} atualizada com sucesso.` })

    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        res.status(500).json({ message: "Erro ao atualizar tarefa." });
    }


})

// DELETE (Deletar Tarefa) -> Parâmetro: ID
router.delete("/tasks/:id", async (req, res) => {

    const {id} = req.params;

    const query = `
        DELETE FROM dbo.Tasks WHERE id = @id
    `;

    try {
        const pool = await mssql.connect();
        const result = await pool.request().input("id", mssql.Int, id).query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: `Tarefa com ID ${id} não encontrada.` });
        }


        res.status(204).send()
    } catch (error) {
        console.error("Erro ao tentar deletar tarefa por ID:", error);
        res.status(500).json({message: "Erro ao deletar tarefa."});
    }


})


export default router;
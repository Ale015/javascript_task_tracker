import mssql from "mssql";

async function createTask(title, description, status = "Not Started"){
    
    const query = `
        INSERT INTO Tasks (title, description, status)
        OUTPUT INSERTED.id, INSERTED.title, INSERTED.description, INSERTED.status, INSERTED.created_at
        VALUES (@title, @description, @status)
        `;
    try{
        const pool = await mssql.connect();
        const result = await pool.request()
            .input("title", mssql.NVarChar, title)
            .input("description", mssql.NVarChar, description)
            .input("status", mssql.NVarChar, status)
            .query(query);

        return result.recordset[0];

    } catch (error) {
        console.error(`Erro ao criar tarefa: `, error)
    }
}

export { createTask };
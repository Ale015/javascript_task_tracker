import {connectDB} from "./db.js";
import dotenv from "dotenv"
import express from "express";

import cors from "cors"

import taskRoutes from "./routes/taskRoutes.js"


import { createTask } from "./models/taskModel.js";

dotenv.config();

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.1.94:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  };
  
  app.use(cors(corsOptions));
  

app.use(express.json());
app.use("/api", taskRoutes)


connectDB();




const PORT = 5000;
app.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta: ${PORT}`)
})
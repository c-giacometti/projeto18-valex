import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.listen(process.env.PORT, () =>
    console.log("servidor rodando na porta " + process.env.PORT)
);
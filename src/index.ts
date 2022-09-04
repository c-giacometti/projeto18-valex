import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cardRouter from "./routes/cardRouter.js";

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.use(cardRouter);

server.listen(process.env.PORT, () =>
    console.log("servidor rodando na porta " + process.env.PORT)
);
import express from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";

import cardRouter from "./routes/cardRouter.js";
import rechargeRouter from "./routes/rechargeRouter.js";
import purchaseRouter from "./routes/purchaseRouter.js";
import errorHandler from "./middlewares/errorHandlerMiddleware.js";

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.use(cardRouter);
server.use(rechargeRouter);
server.use(purchaseRouter);
server.use(errorHandler)

server.listen(process.env.PORT, () =>
    console.log("servidor rodando na porta " + process.env.PORT)
);
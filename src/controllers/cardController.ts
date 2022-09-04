import { Request, Response } from "express";

import { createCardService } from "../services/cardService";

export async function createCard(req: Request, res: Response){

    const apiKey = req.headers;
    const { employeeId, type } = req.body;

    await createCardService(apiKey.toString(), employeeId, type);

    res.status(201).send("card created successfully");
    
}
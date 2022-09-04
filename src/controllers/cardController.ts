import { Request, Response } from "express";

import { activateCardSchema, createCardSchema } from "../schemas/cardSchema.js";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response){

    try {
        const {"x-api-key": apiKey } = req.headers;
        const { employeeId, type } = req.body;

        const validRequest = createCardSchema.validate(req.body);

        if(validRequest.error){
            return res.status(422).send("invalid data format");
        }

        await cardService.createCardService(apiKey.toString(), employeeId, type);

        res.status(201).send("card created successfully");
        
    } catch (error){
        if(error.type === "error_unauthorized"){
            return res.status(401).send(error.message);
        }
    
        if(error.type === "error_not_found"){
            return res.status(404).send(error.message);
        }
    
        if(error.type === "error_conflit"){
            return res.status(402).send(error.message);
        }

        if(error.type === "error_forbidden"){
            return res.status(403).send(error.message);
        }
    
        return res.status(500).send(error.message);
    
    }

}

export async function activateCard(req: Request, res: Response){

    try {
        const { employeeId, cardId, CVV, password } = req.body;

        const validRequest = activateCardSchema.validate(req.body);

        if(validRequest.error){
            return res.status(422).send("invalid data format");
        }

        await cardService.activateCardService(employeeId, cardId, CVV, password);
    
        res.status(201).send("card activated successfully");

    } catch (error){
        if(error.type === "error_unauthorized"){
            return res.status(401).send(error.message);
        }
    
        if(error.type === "error_not_found"){
            return res.status(404).send(error.message);
        }
    
        if(error.type === "error_conflit"){
            return res.status(402).send(error.message);
        }

        if(error.type === "error_forbidden"){
            return res.status(403).send(error.message);
        }
    
        return res.status(500).send(error.message);
    
    }
    
}
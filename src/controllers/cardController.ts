import { Request, Response } from "express";

import { activateCardSchema, changeStatusSchema, createCardSchema, getTransactionsSchema } from "../schemas/cardSchema.js";
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
        if(error.type === "error_bad_request"){
            return res.status(400).send(error.message);
        }

        if(error.type === "error_unauthorized"){
            return res.status(401).send(error.message);
        }
    
        if(error.type === "error_not_found"){
            return res.status(404).send(error.message);
        }
    
        if(error.type === "error_conflict"){
            return res.status(409).send(error.message);
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
    
        res.status(200).send("card activated successfully");

    } catch (error){
        if(error.type === "error_bad_request"){
            return res.status(400).send(error.message);
        }

        if(error.type === "error_unauthorized"){
            return res.status(401).send(error.message);
        }
    
        if(error.type === "error_not_found"){
            return res.status(404).send(error.message);
        }
    
        if(error.type === "error_conflict"){
            return res.status(409).send(error.message);
        }

        if(error.type === "error_forbidden"){
            return res.status(403).send(error.message);
        }
    
        return res.status(500).send(error.message);
    
    }
    
}

export async function getTransactions(req: Request, res: Response){

    try {

        const { employeeId, cardId } = req.body;

        const validRequest = getTransactionsSchema.validate(req.body);

        if(validRequest.error){
            return res.status(422).send("invalid data format");
        }

        const transactionsData = await cardService.getTransactionsService(employeeId, cardId);
    
        res.status(200).send(transactionsData);

    } catch (error){
        if(error.type === "error_bad_request"){
            return res.status(400).send(error.message);
        }
        
        if(error.type === "error_unauthorized"){
            return res.status(401).send(error.message);
        }
    
        if(error.type === "error_not_found"){
            return res.status(404).send(error.message);
        }
    
        if(error.type === "error_conflict"){
            return res.status(409).send(error.message);
        }

        if(error.type === "error_forbidden"){
            return res.status(403).send(error.message);
        }
    
        return res.status(500).send(error.message);
    
    }

}

export async function cardBlock(req: Request, res: Response){

    try {

    const { cardId, employeeId, password } = req.body;

    const validRequest = changeStatusSchema.validate(req.body);

    if(validRequest.error){
        return res.status(422).send("invalid data format");
    }

    await cardService.ChangeCardStatus("block", cardId, employeeId, password);

    res.status(200).send("card blocked");

    } catch (error){
        if(error.type === "error_bad_request"){
            return res.status(400).send(error.message);
        }

        if(error.type === "error_unauthorized"){
            return res.status(401).send(error.message);
        }
    
        if(error.type === "error_not_found"){
            return res.status(404).send(error.message);
        }
    
        if(error.type === "error_conflict"){
            return res.status(409).send(error.message);
        }

        if(error.type === "error_forbidden"){
            return res.status(403).send(error.message);
        }
    
        return res.status(500).send(error.message);
    
    }

}

export async function cardUnblock(req: Request, res: Response){

    try {

        const { cardId, employeeId, password } = req.body;
    
        const validRequest = changeStatusSchema.validate(req.body);
    
        if(validRequest.error){
            return res.status(422).send("invalid data format");
        }
    
        await cardService.ChangeCardStatus("unblock", cardId, employeeId, password);
    
        res.status(200).send("card unblocked");
    
    } catch (error){
        if(error.type === "error_bad_request"){
            return res.status(400).send(error.message);
        }

        if(error.type === "error_unauthorized"){
            return res.status(401).send(error.message);
        }
        
        if(error.type === "error_not_found"){
            return res.status(404).send(error.message);
        }
        
        if(error.type === "error_conflict"){
            return res.status(409).send(error.message);
        }
    
        if(error.type === "error_forbidden"){
            return res.status(403).send(error.message);
        }
        
        return res.status(500).send(error.message);
        
    }

}
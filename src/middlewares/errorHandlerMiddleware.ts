import { Response } from "express";

export default function errorHandler(error, _req, res: Response, _next){

    console.log(error)

    if(error.type === "error_unauthorized"){
        return res.status(401).send(error.message);
    }

    if(error.type === "error_not_found"){
        return res.status(404).send(error.message);
    }

    if(error.type === "error_conflit"){
        return res.status(402).send(error.message);
    }

    return res.status(500).send(error.message);

}
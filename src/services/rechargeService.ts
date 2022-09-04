import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

dayjs.extend(customParseFormat);

export async function rechargeCardService(
    apiKey: string,
    cardId: number,
    amount: number
) {

    //verificar se valor é maior que 0
    if(amount <= 0){
        throw {
            type: "error_bad_request",
            message: "invalid recharge amount"
        }
    }

    //verificar se cartão é cadastrado
    const card = await cardRepository.findById(cardId);

    if(!card){
        throw {
            type: "error_not_found",
            message: "card not found"
        }
    }

    //verificar se a apiKey pertence a uma empresa
    const company = await companyRepository.findByApiKey(apiKey);

    if(!company){
        throw {
            type: "error_unauthorized",
            message: "incorrect api key"
        }
    }

    //verificar se cartão já foi ativado
    if(!card.password){
        throw {
            type: "error_bad_request",
            message: "inactive card"
        }
    }

    //verificar se cartão não expirou
    if (!dayjs().isBefore(dayjs(card.expirationDate, 'MM/YY'), 'month')) {
        throw {
            type: "error_forbidden",
            message: "card expired"
        }
    }

    await rechargeRepository.insert({ cardId, amount });

}
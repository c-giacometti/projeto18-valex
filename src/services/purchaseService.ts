import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import bcrypt from "bcrypt";

import * as businessRepository from "../repositories/businessRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

dayjs.extend(customParseFormat);

export async function purchaseService(
    cardId: number,
    password: string,
    businessId: number,
    amount: number
){

    //verificar se valor é maior que 0
    if(amount <= 0){
        throw {
            type: "error_bad_request",
            message: "invalid purchase amount"
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

    //verificar se cartão não está bloqueado
    if(card.isBlocked === true){
        throw {
            type: "error_forbidden",
            message: "card blocked"
        }
    }

    //verificar se estabelecimento é cadastrado
    const business = await businessRepository.findById(businessId);

    if(!business){
        throw {
            type: "error_not_found",
            message: "business not found"
        }
    }

    //verificar se tipo do estabelecimento corresponde ao tipo do cartão
    if(business.type !== card.type){
        throw {
            type: "error_forbidden",
            message: "unauthorized card type"
        }
    }

    //verificar senha do cartão
    const validPassword = bcrypt.compareSync(password,card.password);

    if(!validPassword){
        throw {
            type: "error_forbidden",
            message: "wrong data"
        }
    }

    //verificar se saldo é suficiente
    const recharges = await rechargeRepository.findByCardId(cardId);
    let rechargeValues = 0;
    if(recharges.length > 0){
        recharges.map((recharge) => rechargeValues += recharge.amount);
    }

    const purchases = await paymentRepository.findByCardId(cardId);
    let purchaseValues = 0;
    if(purchases.length > 0){
        purchases.map((purchase) => purchaseValues += purchase.amount);
    }

    const balance = rechargeValues - purchaseValues;

    if(amount > balance){
        throw {
            type: "error_bad_request",
            message: "insufficient balance"
        }
    }

    //inserir compra
    await paymentRepository.insert({ cardId, businessId, amount });

}
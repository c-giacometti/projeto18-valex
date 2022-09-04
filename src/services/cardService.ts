import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import bcrypt from "bcrypt";

import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

dayjs.extend(customParseFormat);

export async function createCardService( 
    apiKey: string, 
    employeeId: number,  
    type: "groceries"| "restaurant"| "transport"| "education"| "health"
){

    //verificar se a apiKey pertence a uma empresa
    const company = await companyRepository.findByApiKey(apiKey);

    if(!company){
        throw {
            type: "error_unauthorized",
            message: "incorrect api key"
        }
    }

    //verificar se o empregado é cadastrado
    const employee = await employeeRepository.findById(employeeId);

    if(!employee){
        throw {
            type: "error_not_found",
            message: "employee not found"
        }
    }

    //verificar se o empregado já tem um cartão desse tipo
    const cardExists = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

    if(cardExists){
        throw {
            type: "error_conflict",
            message: "card already exists"
        }
    }

    //gerar número do cartão e CVV
    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);
    const randomCardNumber: string = faker.finance.creditCardNumber("####-####-####-####");
    const randomCardCVV = cryptr.encrypt(faker.finance.creditCardCVV());
    
    //gerar nome do usuário
    const [firstName, ...otherNames] = employee.fullName.split(" ");
    const lastName = otherNames.pop();
    const middleNames = otherNames.filter((name) => name.length >= 3).map(n => n[0]);
    const cardholderName = [firstName, ...middleNames, lastName].join(" ").toUpperCase();

    //gerar data de validade
    const expirationDate = dayjs().add(5, "years").format("MM/YY");

    const card = {
        employeeId,
        number: randomCardNumber,
        cardholderName,
        securityCode: randomCardCVV,
        expirationDate,
        isVirtual: false,
        isBlocked: true,
        type
    }

    await cardRepository.insert(card);

}

export async function activateCardService(
    employeeId: number,
    cardId: number,
    CVV: string,
    password: string
){
    //verificar se cartão é cadastrado
    const card = await cardRepository.findById(cardId);

    if(!card){
        throw {
            type: "error_not_found",
            message: "card not found"
        }
    }

    //verificar se cartão é do funcionário
    if(card.employeeId !== employeeId){
        throw {
            type: "error_unauthorized",
            message: "unauthorized user"
        }
    }

    //verificar se cartão não expirou
    if (!dayjs().isBefore(dayjs(card.expirationDate, 'MM/YY'), 'month')) {
        throw {
            type: "error_forbidden",
            message: "card expired"
        }
    }

    //verificar se cartão já foi ativado
    if(card.password){
        throw {
            type: "error_forbidden",
            message: "card already active"
        }
    }

    //verificar CVV
    const cryptr = new Cryptr(process.env.CRYPT_SECRET_KEY);

    if (CVV !== cryptr.decrypt(card.securityCode)) {
        throw {
            type: "error_unauthorized",
            message: "wrong data"
        }
    }

    //validar se senha possui 4 números, criptografar e persistir senha
    if(password.length !== 4){
        throw {
            type: "error_forbidden",
            message: "password must consist of 4 numbers"
        }
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    //update da senha
    await cardRepository.update(cardId, { password: passwordHash });
    
}

export async function getTransactionsService(
    employeeId: number,
    cardId: number
) {

    //verificar se cartão é cadastrado
    const card = await cardRepository.findById(cardId);

    if(!card){
        throw {
            type: "error_not_found",
            message: "card not found"
        }
    }

    //verificar se cartão é do funcionário
    if(card.employeeId !== employeeId){
        throw {
            type: "error_unauthorized",
            message: "unauthorized user"
        }
    }

    //obter recargas
    const recharges = await rechargeRepository.findByCardId(cardId);
    let rechargeValues = 0;
    if(recharges.length > 0){
        recharges.map((recharge) => rechargeValues += recharge.amount);
    }

    //obter compras
    const purchases = await paymentRepository.findByCardId(cardId);
    let purchaseValues = 0;
    if(purchases.length > 0){
        purchases.map((purchase) => purchaseValues += purchase.amount);
    }

    //retornar saldo e transações
    const balance = rechargeValues - purchaseValues;
    const transactionsData = {
        balance,
        "transactions": purchases,
        "recharges": recharges
    }

    return transactionsData;

}

export async function ChangeCardStatus(
    action: string,
    cardId: number,
    employeeId: number,
    password: string
){

    //verificar se cartão é cadastrado
    const card = await cardRepository.findById(cardId);

    if(!card){
        throw {
            type: "error_not_found",
            message: "card not found"
        }
    }

    //verificar se cartão é do funcionário
    if(card.employeeId !== employeeId){
        throw {
            type: "error_unauthorized",
            message: "unauthorized user"
        }
    }

    //verificar se cartão não expirou
    if (!dayjs().isBefore(dayjs(card.expirationDate, 'MM/YY'), 'month')) {
        throw {
            type: "error_forbidden",
            message: "card expired"
        }
    }

    //verificar ação e status (bloq/desbloq)
    if(action === "block" && card.isBlocked === true){
        throw {
            type: "error_conflict",
            message: "card already blocked"
        }
    }

    else if(action === "unblock" && card.isBlocked === false){
        throw {
            type: "error_conflict",
            message: "card already unblocked"
        }
    }

    else if(action !== "block" && action !== "unblock"){
        throw {
            type: "error_forbidden",
            message: "Invalid request"
        }
    }

    //verificar senha
    const validPassword = bcrypt.compareSync(password,card.password);

    if(!validPassword){
        throw {
            type: "error_forbidden",
            message: "wrong data"
        }
    }

    //mudar status
    if(action === "block"){
        await cardRepository.update(cardId, { isBlocked: true });
    } 
    
    if(action === "unblock"){
        await cardRepository.update(cardId, {isBlocked: false});
    }

}
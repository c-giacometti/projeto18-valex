import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dayjs from "dayjs";

import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { findByTypeAndEmployeeId, insert } from "../repositories/cardRepository";

export async function createCardService( 
    apiKey: string, 
    employeeId: number,  
    type: "groceries"| "restaurant"| "transport"| "education"| "health"
){

    //verificar se a apiKey pertence a uma empresa
    const company = await findByApiKey(apiKey);

    if(!company){
        throw {
            type: "error_unauthorized",
            message: "incorrect api key"
        }
    }

    //verificar se o empregado é cadastrado
    const employee = await findById(employeeId);

    if(!employee){
        throw {
            type: "error_not_found",
            message: "employee not found"
        }
    }

    //verificar se o empregado já tem um cartão desse tipo
    const cardExists = await findByTypeAndEmployeeId(type, employeeId);

    if(cardExists){
        throw {
            type: "error_conflit",
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
    const middleNames = otherNames.filter((name) => name.length >= 3);
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

    await insert(card);

}
import joi from "joi";

export const purchaseSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string()
        .regex(/^[0-9]*$/)
        .length(4)
        .required(),
    businessId: joi.number().required(),
    amount: joi.number().required()
});
import joi from "joi";

export const rechargeSchema = joi.object({
    cardId: joi.number().required(),
    amount: joi.number().greater(0).required()
});
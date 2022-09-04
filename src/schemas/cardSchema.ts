import joi from "joi";

const createCardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.string()
        .valid("groceries", "restaurants", "transport", "education", "health")
        .required()
});

const activateCardSchema = joi.object({
    employeeId: joi.number().required(),
    cardId: joi.number().required(),
    CVV: joi.string()
        .regex(/^[0-9]*$/)
        .length(3)
        .required(),
    password: joi.string()
        .regex(/^[0-9]*$/)
        .length(4)
        .required()
});

const changeStatusSchema = joi.object({
    cardId: joi.number().required(),
    employeeId: joi.number().required(),
    password: joi.string()
        .regex(/^[0-9]*$/)
        .length(4)
        .required()
})

export { createCardSchema, activateCardSchema, changeStatusSchema };
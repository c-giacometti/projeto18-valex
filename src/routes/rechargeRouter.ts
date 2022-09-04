import { Router } from "express";
import * as rechargeController from "../controllers/rechargeController.js"
import validateApiKey from "../middlewares/apiKeyMiddleware.js";

const router = Router();

router.post("/recharge", validateApiKey, rechargeController.rechargeCard);

export default router;
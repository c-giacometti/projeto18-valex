import { Router } from "express";
import * as cardController from "../controllers/cardController.js";
import validateApiKey from "../middlewares/apiKeyMiddleware.js";

const router = Router();

router.post("/create", validateApiKey, cardController.createCard);
router.post("/activate", cardController.activateCard);
router.get("/transactions", cardController.getTransactions);
router.put("/block", cardController.cardBlock);
router.put("/unblock", cardController.cardUnblock);

export default router;
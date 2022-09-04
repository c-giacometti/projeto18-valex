import { Router } from "express";
import * as purchaseController from "../controllers/purchaseController.js";

const router = Router();

router.post("/purchase", purchaseController.postPurchase);

export default router;
import { Router } from "express";

import { postTransaction } from "../controllers/transaction.controller";
import { asyncHandler } from "../middlewares/handler.middleware";



const router = Router();

router.post( "/create", asyncHandler( postTransaction ) );

export default router;


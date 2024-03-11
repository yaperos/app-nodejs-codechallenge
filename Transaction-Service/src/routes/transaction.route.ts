import { Router } from "express";

import { getTransactionByExternalId, postTransaction } from "../controllers/transaction.controller";
import { asyncHandler } from "../middlewares/handler.middleware";



const router = Router();

router.post( "/create", asyncHandler( postTransaction ) );

router.get( "/:id", asyncHandler( getTransactionByExternalId ) );

export default router;


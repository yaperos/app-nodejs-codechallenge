import { Router } from "express";

import { getTransactionByExternalId, postTransaction, updateStatusTransaction } from "../controllers/transaction.controller";
import { asyncHandler } from "../middlewares/handler.middleware";



const router = Router();

router.post( "/create", asyncHandler( postTransaction ) );

router.get( "/:id", asyncHandler( getTransactionByExternalId ) );

router.put( "/:id", asyncHandler( updateStatusTransaction ) );

export default router;


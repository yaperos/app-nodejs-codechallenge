import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "./errorMiddleware";

export const validateDTO = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {  
    schema.parse({
      ...req.params,  
      ...req.body,    
    });
    next();
  } catch (err: any) {
    next(new AppError(`USR => ${err.errors[0].message}`, 400));
  }
};

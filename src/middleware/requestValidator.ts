import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

export const requestValidator =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(
      { ...req.body, ...req.params, ...req.query },
      { abortEarly: false }
    );

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ message: errorMessage });
    }

    next();
  };

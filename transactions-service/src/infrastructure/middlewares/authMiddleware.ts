import { Request, Response, NextFunction } from "express";
import { config } from 'dotenv';
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError, InvalidTokenError } from "./errorMiddleware";

config();

const JWT_SECRET = process.env.JWT_SECRET as string; 

// Definir una interfaz para los datos del usuario en el token
interface DecodedUser extends JwtPayload {
  userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // `Bearer <TOKEN>`

    if (!token) throw new UnauthorizedError("JWT => No autorizado, token no proporcionado");

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
    (req as any).user = decoded; 
    
    next();
  } catch (error) {
    next(new InvalidTokenError("JWT => Token inválido o expirado"));
  }
};

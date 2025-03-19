import { config } from 'dotenv';
import jwt from "jsonwebtoken";
/* Middleware */
import { NotFoundError, DatabaseError } from '../infrastructure/middlewares/errorMiddleware'
/* Repositorios */
import { LoginRepository } from "../infrastructure/repository/LoginRepository";

config(); 

const JWT_SECRET = process.env.JWT_SECRET as string;
export class LoginService {
      private loginRepository = new LoginRepository();

    /* 
    * Login
    */
    async login(username: string, password: string) {
        // *1. Valida que exista usuario*
        const existingUser = await this.validateUser(username);

        // *2. Valida que la clave coincida *
        this.validatePassword(existingUser.password, password);
    
        // *3. Genera Token*
        const token = await this.generateToken(existingUser.id);
        
        return token;
    }

    private async validateUser(username: string) {
        try {
            const existingUser = await this.loginRepository.findOnlyByUsername(username);
            if (!existingUser) throw new NotFoundError(`USR => El usuario ${username} no existe en la DB`);    
    
            return existingUser;
        } catch (error) {
            throw new DatabaseError(`Error al obtener el usuario desde la DB: ${error}`);
        }
    }

    private validatePassword(storedPassword: string, providedPassword: string): void {
        if (storedPassword !== providedPassword) throw new NotFoundError('USR => La contraseña es incorrecta.');
    }

    /* 
    * Genera JWT para el usuario 
    */
    async generateToken(userId: string) {   
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    }

}

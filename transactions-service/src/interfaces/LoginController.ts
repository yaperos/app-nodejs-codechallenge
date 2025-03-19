import { Request, Response, NextFunction } from 'express';
import { LoginService } from '../application/LoginService';


export class LoginController {
    private loginService = new LoginService();
    
    /**
     * @swagger
     * /login:
     *   post:
     *     summary: Iniciar sesión
     *     tags: [Autenticación]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 example: "usuario123"
     *               password:
     *                 type: string
     *                 example: "password_secreto"
     *     responses:
     *       200:
     *         description: Sesión iniciada correctamente
     *       401:
     *         description: Credenciales incorrectas
     *       500:
     *         description: Error interno del servidor
     */
    login = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { username, password } = req.body;
        const token = await this.loginService.login(username, password);

        res.json({ token });
      } catch (error) {
        next(error);
      }
    };
}

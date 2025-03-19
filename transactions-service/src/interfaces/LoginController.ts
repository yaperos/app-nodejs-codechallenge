import { Request, Response, NextFunction } from 'express';
import { LoginService } from '../application/LoginService';


export class LoginController {
    private loginService = new LoginService();
 
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

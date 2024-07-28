import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { envs } from '../../config';



export class AuthRoutes {


  static get routes(): Router {

    const router = Router();
    const emailService = new EmailService(envs.MAILER_SERVICE,envs.MAILER_EMAIL,envs.MAILER_SECRET_KEY);
    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);
    
    // Definir las rutas
    // router.use('/api/todos', /*TodoRoutes.routes */ );
    router.post('/login', controller.loginUser);
    router.post("/register", controller.register);

    //*Validar gmail de user
    router.get('/validate-email/:token', controller.validateEmail);



    return router;
  }


}


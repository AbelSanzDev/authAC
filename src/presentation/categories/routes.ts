
import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategorySevice } from '../services/category.service';






export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();
    const categorySevice = new CategorySevice()
    const controller = new CategoryController(categorySevice);
    

    
    // Definir las rutas
    router.post('/',[AuthMiddleware.validateJwt], controller.createCategory);
    router.get('/',[AuthMiddleware.validateJwt], controller.getCategory );



    return router;
  }


}


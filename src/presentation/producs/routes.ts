
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controller';
import { ProductSevice } from '../services/product.service';







export class ProductsRoutes {


  static get routes(): Router {

    const router = Router();
    const productService = new ProductSevice()
    const controller = new ProductController(productService);
    
    

    
    // Definir las rutas
    router.post('/',[AuthMiddleware.validateJwt], controller.createProduct);
    router.get('/',[AuthMiddleware.validateJwt],controller.getProduct );



    return router;
  }


}


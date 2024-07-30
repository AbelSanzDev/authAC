import { Request, Response } from "express";
import { CustomError } from "../../domain";

import { CategorySevice } from "../services/category.service";
import { PaginationDto } from "../../domain/dtos";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { ProductSevice } from "../services/product.service";

export class ProductController {
  constructor(private readonly productSevice: ProductSevice) {}
  private handleError = (error: any, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  };
  createProduct = async (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });

    if (error) return res.status(400).json({ message: error });

    this.productSevice
      .createProduct(createProductDto!)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res));
  };
  getProduct = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query; //*Esto nos sirve para poder tener query parametes que son de esta manera ?page=1&limit=5
    const [error, paginationDto] = PaginationDto.create(+page, +limit); //*El + que se agrega es para poder convertir esos datos a numeros
    if (error) return res.status(400).json({ message: error });

    this.productSevice
      .getProducts(req.body.user, paginationDto!)
      .then((categories) => res.status(201).json(categories))
      .catch((error) => this.handleError(error, res));
  };
}

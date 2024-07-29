import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { CreateCategoryDto } from "../../domain/dtos";
import { CategorySevice } from "../services/category.service";




export class CategoryController{
    constructor(
        private readonly categorySevice:CategorySevice
    ){}
    private handleError = (error:any,res:Response)=>{
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({message:error.message});
        }

        return res.status(500).json({message:"Internal server error"});
    }

    createCategory =async(req:Request, res:Response)=>{
        const [error, createCategoryDto] = CreateCategoryDto.crate(req.body);
        if(error) return res.status(400).json({message:error});
        this.categorySevice.createCategory(createCategoryDto!,req.body.user)
        .then(category => res.status(201).json(category))
        .catch(error=> this.handleError(error, res));

    }
    getCategory = async(req:Request,res:Response)=>{
        this.categorySevice.getCategories(req.body.user)
        .then(categories => res.status(201).json(categories))
        .catch(error => this.handleError(error,res));
    }
}
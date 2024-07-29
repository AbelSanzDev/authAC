import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { CreateCategoryDto, PaginationDto } from "../../domain/dtos";
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
        const {page=1,limit=10} = req.query;//*Esto nos sirve para poder tener query parametes que son de esta manera ?page=1&limit=5
        const [error, paginationDto] = PaginationDto.create(+page,+limit);//*El + que se agrega es para poder convertir esos datos a numeros
        if(error) return res.status(400).json({message:error});


        this.categorySevice.getCategories(req.body.user, paginationDto!)
        .then(categories => res.status(201).json(categories))
        .catch(error => this.handleError(error,res));
    }
}
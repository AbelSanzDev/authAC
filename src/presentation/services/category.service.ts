import { CategoryModel, UserModel } from "../../data";
import { CustomError } from "../../domain";
import { CreateCategoryDto, PaginationDto } from "../../domain/dtos";
import { UserEntity } from "../../domain/entities/user.entities";




export class CategorySevice{
    constructor(

    ){}


    public async createCategory(createCategoryDto:CreateCategoryDto, user:UserEntity){
        const categoryExist = await CategoryModel.findOne({name: createCategoryDto.name});
        if(categoryExist) throw CustomError.badRequest("Category already exist");

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user:user.id
            })
            await category.save();
            
            return {
                id:category.id,
                name:category.name,
                available:category.available
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
    public async getCategories(user:UserEntity,paginationDto:PaginationDto){

        const {page, limit} = paginationDto;

        try {
           
            const userFound = await UserModel.findById(user.id);
            if(!userFound) throw CustomError.badRequest("User not found");
            // const total = await CategoryModel.countDocuments();//*Para el total de registros
            // //*Asi se hace la paginacion desde mongo con el skip para ver cuantas paginas se veran y con limit para el limite que tendra
            // const getAllUserCategories = await CategoryModel.find({user:userFound._id}).skip((page - 1) * limit).limit(limit);
            //*Esto se utiliza para poder hacer llamadas de await de forma sincrona
            const [total,getAllUserCategories]=  await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find({user:userFound._id}).skip((page - 1) * limit).limit(limit)

            ])
            if(!getAllUserCategories) throw CustomError.badRequest("Categories empty");
            
            return getAllUserCategories;
        } catch (error) {
            throw CustomError.internalServer("Internal Sever error");
        }
        
    }
}
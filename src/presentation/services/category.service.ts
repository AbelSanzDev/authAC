import { CategoryModel, UserModel } from "../../data";
import { CustomError } from "../../domain";
import { CreateCategoryDto } from "../../domain/dtos";
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
    public async getCategories(user:UserEntity){

        try {
            const userFound = await UserModel.findById(user.id);
        if(!userFound) throw CustomError.badRequest("User not found");
        const getAllUserCategories = await CategoryModel.find({user:userFound._id});
        if(!getAllUserCategories) throw CustomError.badRequest("Categories empty");
        
        return getAllUserCategories;
        } catch (error) {
            throw CustomError.internalServer("Internal Sever error");
        }
        
    }
}
import { CategoryModel, ProductModel, UserModel } from "../../data";
import { CustomError } from "../../domain";
import { CreateCategoryDto, PaginationDto } from "../../domain/dtos";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { UserEntity } from "../../domain/entities/user.entities";

export class ProductSevice {
  constructor() {}

  public async createProduct(createProductDto: CreateProductDto) {
    const prouctExist = await ProductModel.findOne({
      name: createProductDto.name,
    });
    if (prouctExist) throw CustomError.badRequest("Product already exist");

    try {
      const product = new ProductModel(createProductDto);
      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  public async getProducts(user: UserEntity, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const userFound = await UserModel.findById(user.id);
      if (!userFound) throw CustomError.badRequest("User not found");
      // const total = await CategoryModel.countDocuments();//*Para el total de registros
      // //*Asi se hace la paginacion desde mongo con el skip para ver cuantas paginas se veran y con limit para el limite que tendra
      // const getAllUserCategories = await CategoryModel.find({user:userFound._id}).skip((page - 1) * limit).limit(limit);
      //*Esto se utiliza para poder hacer llamadas de await de forma sincrona
      const [total, getAllUserProducts] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find({ user: userFound._id })
          .skip((page - 1) * limit)
          .limit(limit),
      ]);
      if (!getAllUserProducts) throw CustomError.badRequest("Categories empty");

      return getAllUserProducts;
    } catch (error) {
      throw CustomError.internalServer("Internal Sever error");
    }
  }
}

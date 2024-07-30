import { Validators } from "../../../config/validators";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: string,
    public readonly description: string,
    public readonly user: string, //ID
    public readonly category: string //ID
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = object;
    if (!name) return ["Missing name", undefined];
    if (!user) return ["Missing user", undefined];
    if (!category) return ["Missing category", undefined];
    if (!Validators.isMongoID(user)) return ["Invalid mongo id"];
    if (!Validators.isMongoID(category)) return ["Invalid mongo id"];

    return [
      undefined,
      new CreateProductDto(
        name,
        !!available,
        price,
        description,
        user,
        category
      ),
    ];
  }
}

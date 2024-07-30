import { bcryptAdapter, envs, JwtAdaper } from "../../config";
import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { UserEntity } from "../../domain/entities/user.entities";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    //DI Email service
    private readonly emailService: EmailService
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;
    const existUser = await UserModel.findOne({ email: email });
    if (existUser) throw CustomError.badRequest("Email aready exist");
    try {
      const user = new UserModel(registerUserDto);

      //encriptar el password
      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();

      //JWT para menter la autenticacion del usuario
      const token = await JwtAdaper.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer("Error while creating JWT");

      //Email de confirmacion
      await this.sendEmailWithValidationLink(user.email!);

      //*De esta manera sacamos el password para no mostrarlo y lo mostrar el resto
      const { password, ...rest } = UserEntity.fromObject(user);
      //*De esta menera se retorna el resto o rest
      return { ...rest, token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  public async loginService(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.badRequest("User not found");

    const isPasswordValid = bcryptAdapter.compare(password, user.password!);
    if (!isPasswordValid)
      throw CustomError.unAuthorized("The password is incorect");

    const { password: pass, ...rest } = UserEntity.fromObject(user);

    const token = await JwtAdaper.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServer("Error while creating JWT");

    return { ...rest, token };
  }

  private sendEmailWithValidationLink = async (email: string) => {
    const token = await JwtAdaper.generateToken({ email });
    if (!token) throw CustomError.internalServer("Error getting token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
            <h1>Validate your email</h1>
            <h2>Click on the following link to validate your email</h2>
            <a href="${link}">Go</a>
        `;
    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSet = await this.emailService.sendEmail(options);
    if (!isSet) throw CustomError.internalServer("Error sending email");
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdaper.validateToken(token);
    if (!payload) throw CustomError.unAuthorized("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Id not in token");

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.notFound("User not found");

    user.emailValidated = true;

    await user.save();

    return true;
  };
}

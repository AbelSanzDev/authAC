import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { UserEntity } from "../../domain/entities/user.entities";




export class AuthService{
    constructor(
       
    ){}

    public async registerUser(registerUserDto:RegisterUserDto){
        const {name,email,password} = registerUserDto;
        const existUser = await UserModel.findOne({email:email});
        if(existUser) throw CustomError.badRequest("Email aready exist");
        try {
            
            const user = new UserModel(registerUserDto);
            
            //encriptar el password
            user.password = bcryptAdapter.hash(registerUserDto.password);
            
            await user.save();
            //JWT para menter la autenticacion del usuario


            //Email de confirmacion


            //*De esta manera sacamos el password para no mostrarlo y lo mostrar el resto
            const {password,...rest} = UserEntity.fromObject(user);
            //*De esta menera se retorna el resto o rest
            return {...rest, token:"ABC"};

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }    

    }
    public async loginService(loginUserDto:LoginUserDto){
        const {email, password} = loginUserDto;

        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.badRequest("User not found");


        const isPasswordValid = bcryptAdapter.compare(password,user.password!);
        if(!isPasswordValid) throw CustomError.unAuthorized("The password is incorect");

        const {password:pass,...rest} = UserEntity.fromObject(user);

        return {...rest}
        
    }
}
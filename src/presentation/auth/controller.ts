import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos";
import { AuthService } from "../services/auth.service";
import { error } from "console";
import { CustomError } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";




export class AuthController{

    constructor(
        public readonly authService:AuthService
    ){}

    private handleError = (error:any,res:Response)=>{
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({message:error.message});
        }

        return res.status(500).json({message:"Internal server error"});
    }

    register = (req:Request,res:Response)=>{
        const [error,registerUserDto] =  RegisterUserDto.create(req.body);
       if(error)return res.status(400).json({message:error});
       
       this.authService.registerUser(registerUserDto!)
       .then((user)=> res.json(user))
       .catch(error => this.handleError(error,res))
    }
    loginUser = (req:Request,res:Response)=>{
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if(error) return res.status(404).json({message:error});

        this.authService.loginService(loginUserDto!)
        .then(user=> res.json(user))
        .catch(error=> this.handleError(error,res));
    }
    validateEmail = (req:Request,res:Response)=>{
        res.json("emial user")
    }
}
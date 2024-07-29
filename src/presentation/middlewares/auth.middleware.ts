import { NextFunction, Request, Response } from "express";
import { JwtAdaper } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain/entities/user.entities";




export class AuthMiddleware{

    static async validateJwt(req:Request,res:Response,next:NextFunction){
        const auth = req.header('Authorization');
        if(!auth) return res.status(401).json({message:"No token provided"});
        if(!auth.startsWith("Bearer ")) return res.status(401).json({message:"Invalid baerer token"});

        const token = auth.split(' ').at(1) || '';

        try {
            
            const payload = await JwtAdaper.validateToken<{id:string}>(token);
            if(!payload) return res.status(401).json({message:"Invalid token"});
            
            const user = await UserModel.findById(payload.id);
            if(!user) return res.status(401).json({message:"Invalid token - user"});
            //TODO: Validar si el usuario esta activo

            req.body.user = UserEntity.fromObject(user);

            next();
        } catch (error) {
            return res.status(500).json({message:error});
        }
    }
}
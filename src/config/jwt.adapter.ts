import jwt from  'jsonwebtoken';
import { envs } from './envs';


const JWT_SEED = envs.JWT_SEED;

export class JwtAdaper{

    

    static async generateToken(payload:any, duration:string = "2h"){

        return new Promise((resolve)=>{
            jwt.sign(payload,JWT_SEED,{expiresIn:duration}, (err,token)=>{
                if(err) return resolve(null);

                return resolve(token);
            })  
        })
        
    }

    //*Validando si el token que tiene el usuario aun esta disponible
    static validateToken(token:string){ 
        
        return new Promise((resolve)=>{
            jwt.verify(token, JWT_SEED,(err,decoded)=>{
                if(err) return resolve(null);
                resolve(decoded);
            })
        })
    }
}
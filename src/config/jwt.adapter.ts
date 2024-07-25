import jwt from  'jsonwebtoken';
import { resolve } from 'path';
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

    static validateToken(token:string){


        return;//*Se retorna el payload
    }
}
import { regularExps } from "../../../config";




export class LoginUserDto{

    constructor(
        public readonly email:string,
        public readonly password: string
    ){}

    static create(object:{[key:string]:any}):[string?,LoginUserDto?]{
        const { email,password } = object;
        if(!email) return ['Missing email', undefined];
        if(!regularExps.email.test(email)) return ['Email is no valid',undefined];
        if(!password) return ['Missing password', undefined]

        return [undefined,new LoginUserDto(email,password)];
    }
}
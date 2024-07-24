import { regularExps } from "../../../config";




export class RegisterUserDto{
    constructor(
        public name:string,
        public email:string,
        public password:string
    ){}

    static create(object:{[key:string]:any}):[string?,RegisterUserDto?]{

        const {name, email, password} = object
        if(!name) return ['Missing name', undefined];
        if(!email) return ['Missing email', undefined];
        if(!regularExps.email.test(email)) return ['Email is no valid',undefined];
        if(!password) return ['Missing password', undefined]
        if(password < 6) return ['Password must have al least 6 characters', undefined];

        return[undefined, new RegisterUserDto(name,email,password)];

    }
}



//*Esta clase nos permite poder manejar todos los errores de nuestra aplicacion
export class CustomError extends Error{
    //*Este connstructor es pirvado devido a que solo se utiliza en esta clase en cual recibe el codigo de error y el menssage
   private constructor(
        public readonly statusCode:number,
        public readonly message:string
    ){
        super(message);
    }

    static badRequest(message:string){
        return new CustomError(400, message);
    }
    static unAuthorized(message:string){
        return new CustomError(401,message);
    }
    static forbidden(message:string){
        return new CustomError(403,message);
    }
    static notFound(message:string){
        return new CustomError(404,message);
    }
    static internalServer(message:string){
        return new CustomError(500,message);
    }
}
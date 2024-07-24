import mongoose from "mongoose";


const userSchema = new mongoose.Schema({


    name:{
        type:String,
        require:[true,"Name is required"]
    },
    email:{
        type:String,
        require:[true,"Name is required"],
        unique:[true,"This email is being used"]
    },
    emailValidated:{
        type:Boolean,
        default:false        
    },
    password:{
        type:String,
        require:[true,"Password is required"]
    },
    img:{
        type:String
    },
    role:{
        type:[String],
        default:"USER_ROLE",
        enum:["ADMIN_ROLE","USER_ROLE"]
    }
})

export const UserModel = mongoose.model('user',userSchema);
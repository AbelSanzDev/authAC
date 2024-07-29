import mongoose, { Schema } from "mongoose";


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Name is required"],
        unique:true
    },
   available:{
    type:Boolean,
    default:false
   },
   price:{
    type:Number,
    default:0,
   },
   description:{
    type:String
   },
   user:{
    type:Schema.Types.ObjectId,
    ref:'user'
   },

   category:{
    type:Schema.Types.ObjectId,
    ref:'category'
   }
})

export const ProductModel = mongoose.model('product',productSchema);
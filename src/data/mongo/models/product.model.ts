import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
});

//*Esto se hace para poder estilizar el como se veran los datos cuando los mandemos a llamar
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
  },
});

export const ProductModel = mongoose.model("product", productSchema);

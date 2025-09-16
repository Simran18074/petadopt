import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  age: { type: Number, required: true },
  breed: { type: String },
  description: { type: String },
  image: { type: String },
});

const Pet = mongoose.model("Pet", petSchema);

export default Pet; // 👈 ab default export hai

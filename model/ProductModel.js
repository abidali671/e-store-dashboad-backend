import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  short_description: {
    type: String,
    required: [true, "Short Description is required"],
  },
  thumbnails: {
    type: [{ type: String }],
  },
  tags: {
    type: [{ type: String }],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
});

export default mongoose.model.Product ||
  mongoose.model("Product", ProductSchema);

import mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nam is required"],
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
  thumbnail: {
    type: String,
  },
});

export default mongoose.model.Category ||
  mongoose.model("Category", CategorySchema);

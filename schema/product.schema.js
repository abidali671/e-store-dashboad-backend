import Yup from "yup";
import { UnknowKeyHandler } from "../utils/index.js";

const ProductSchema = Yup.object()
  .shape({
    name: Yup.string().required("Username is required"),
    slug: Yup.string().required("Slug is required"),
    description: Yup.string().required("Description is required"),
    short_description: Yup.string().required("Short Description is required"),
    thumbnails: Yup.array().of(Yup.mixed()),
    tags: Yup.array().of(Yup.string()),
    category: Yup.string(),
  })
  .noUnknown(UnknowKeyHandler);

export default ProductSchema;

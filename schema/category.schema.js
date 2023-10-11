import Yup from "yup";
import { UnknowKeyHandler } from "../utils/index.js";

const CategorySchema = Yup.object()
  .shape({
    name: Yup.string().required("Username is required"),
    slug: Yup.string().required("Slug is required"),
    description: Yup.string().required("Description is required"),
    thumbnail: Yup.string(),
  })
  .noUnknown(UnknowKeyHandler);

export default CategorySchema;

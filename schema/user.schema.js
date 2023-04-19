import Yup from "yup";
import { UnknowKeyHandler } from "../utils/index.js";

export const LoginSchema = Yup.object()
  .shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  })
  .noUnknown(UnknowKeyHandler);

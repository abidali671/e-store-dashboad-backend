import Joi from "yup";

const LoginSchema = Joi.object({
  username: Joi.string().required("Username is required"),
  password: Joi.string().required("Password is required"),
});

export default LoginSchema;

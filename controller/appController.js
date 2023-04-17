import bcrypt from "bcrypt";
import UserModel from "../model/User.model.js";
import LoginSchema from "../schema/login.schema.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Register API Controller
export async function register(req, res) {
  try {
    const { username, password, email, first_name, last_name } = req.body;

    const user = new UserModel({
      username,
      email,
      first_name,
      last_name,
      password,
    });

    await user.validate();
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res
      .status(200)
      .send({ username, email, first_name, last_name, id: user._id });
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

// Login API Controller
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    await LoginSchema.validate({ username, password }, { abortEarly: false });

    const user = await UserModel.findOne({ username });

    if (user) res.status(200).send(user);
    else
      throw {
        non_field_error: "Invalid username or password",
      };
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

export async function getUser(req, res) {
  res.json("getUser route");
}

export async function updateUser(req, res) {
  res.json("updateUser route");
}

export async function generateOTP(req, res) {
  res.json("generateOTP route");
}

export async function verifyOTP(req, res) {
  res.json("generateOTP route");
}

export async function createResetSession(req, res) {
  res.json("generateOTP route");
}

export async function resetPassword(req, res) {
  res.json("generateOTP route");
}

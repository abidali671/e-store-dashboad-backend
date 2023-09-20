import bcrypt from "bcrypt";
import UserModel from "../model/User.model.js";

import { Config, ErrorHandler } from "../utils/index.js";
import { LoginSchema } from "../schema/index.js";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      { username, email, first_name, last_name, id: user._id },
      Config.jwtSecret,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).send(token);
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

// Login API Controller
export async function login(req, res) {
  try {
    await LoginSchema.validate(req.body, { abortEarly: false, strict: true });

    const user = await UserModel.findOne({ username: req.body.username });
    const isCorrectPassword =
      user && (await bcrypt.compare(req.body.password, user.password));

    if (isCorrectPassword) {
      const token = jwt.sign(user, Config.jwtSecret, {
        expiresIn: "24h",
      });

      res.status(200).send({ token });
    } else
      throw {
        non_field_error: "Invalid username or password",
      };
  } catch (error) {
    console.log(error);
    res.status(500).send(ErrorHandler(error));
  }
}

// Get User Api Controller
export async function getUser(req, res) {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username });

    if (user)
      res.status(201).send({
        username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    else throw { error: "Invalid Username" };
  } catch (error) {
    res.status(404).send(ErrorHandler(error));
  }
}

// Update User Api Controller
export async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    await UserModel.updateOne({ _id: id }, body);

    res.status(201).send(body);
  } catch (error) {
    res.status(404).send({ error: "Invalid User ID" });
  }
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

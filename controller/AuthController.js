import bcrypt from "bcrypt";
import UserModel from "../model/User.model.js";

import { Config, ErrorHandler } from "../utils/index.js";
import { LoginSchema } from "../schema/index.js";

import optGenerator from "otp-generator";
import jwt from "jsonwebtoken";

async function register(req, res, next) {
  try {
    const { username, password, email, first_name, last_name } = req.body;
    const verification_token = optGenerator.generate(12, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    });

    const user = new UserModel({
      username,
      email,
      first_name,
      last_name,
      password,
      verification_token,
      verified: false,
    });

    await user.validate();
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    req.body.verification_token = verification_token;
    req.body.id = user._id;
    next();
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

async function login(req, res) {
  try {
    await LoginSchema.validate(req.body, { abortEarly: false, strict: true });
    const user = await UserModel.findOne({
      $or: [{ email: req.body.username }, { username: req.body.username }],
    });

    const isCorrectPassword =
      user && (await bcrypt.compare(req.body.password, user.password));

    if (isCorrectPassword) {
      const { first_name, last_name, username, email, verified } = user;

      if (!verified)
        throw {
          non_field_error: "User is not verified",
        };

      const token = jwt.sign(
        { id: user._id, first_name, last_name, username, email },
        Config.jwtSecret,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).send({ token });
    } else
      throw {
        non_field_error: "Invalid username or password",
      };
  } catch (error) {
    res.status(500).send(ErrorHandler(error));
  }
}

async function getUser(req, res) {
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

async function updateUser(req, res) {
  try {
    const user = req.user;
    const body = req.body;
    if (req.params.id !== user.id) throw Error;

    await UserModel.updateOne({ _id: user.id }, body);

    res.status(201).send(body);
  } catch (error) {
    res.status(404).send({ error: "Invalid User ID" });
  }
}

async function generateOTP(req, res) {
  req.app.locals.OTP = optGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).send({ code: req.app.locals.OTP });
}

async function verifyOTP(req, res) {
  try {
    const { code } = req.query;

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res.status(201).send({ msg: "Verify successfully" });
    }
    throw "Invalid OTP!";
  } catch (error) {
    res.status(400).send({ error });
  }
}

async function createResetSession(req, res) {
  try {
    if (req.app.locals.session) {
      req.app.locals.session = false;
      return res.status(201).send({ msg: "Access granted" });
    }
    throw "Session expired!";
  } catch (error) {
    return res.status(401).send({ error });
  }
}

async function resetPassword(req, res) {
  try {
    if (req.app.locals.session) {
      req.app.locals.session = false;
      const { password } = req.query;
      const { username } = req.user;

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.updateOne({ username }, { password: hashedPassword });

      res.status(201, "Password changed successfully");
    }
    throw "Session expired!";
  } catch (error) {
    res.status(401).send({ error });
  }
}
async function verifyUser(req, res) {
  try {
    const { token, id } = req.query;

    const user = await UserModel.findOne({
      _id: id,
    });

    if (!user || user.verification_token !== token) {
      throw "Invalid verification token.";
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({
      message: "Email verified. You can now log in.",
      data: req.query,
    });
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ error });
  }
}

export default {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  verifyUser,
};

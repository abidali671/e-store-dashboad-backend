import { Router } from "express";
import Auth from "../middleware/auth.js";
import VerifyUser from "../middleware/VerifyUser.js";
import localVariables from "../middleware/localVariables.js";
import { RegisterMail } from "../controller/Mailer.js";
import * as controller from "../controller/appController.js";

const router = Router();

router.route("/").get(function register(_, res) {
  res.status(200).send({
    endpoints: {
      register: "/auth/register",
      login: "/auth/login",
    },
  });
});

// Post Methods
router.route("/auth/register").post(controller.register, RegisterMail);
router.route("/auth/register-mail").post(RegisterMail);
// router.route("/auth/authenticate").post(controller);
router.route("/auth/login").post(controller.login);

// Get Methods
router.route("/auth/verify").get(controller.verifyUser);
router.route("/auth/user/:username").get(controller.getUser);
router
  .route("/auth/generate-otp")
  .get(VerifyUser, localVariables, controller.generateOTP);

router.route("/auth/verify-otp").get(VerifyUser, controller.verifyOTP);
router.route("/auth/createResetSession").get(controller.createResetSession);

// Put Methods
router.route("/auth/user/:id").put(Auth, controller.updateUser);
router.route("/auth/resetPassword").put(VerifyUser, controller.updateUser);

export default router;

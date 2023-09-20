import { Router } from "express";
import Auth from "../middleware/auth.js";
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
router.route("/auth/register").post(controller.register);
// router.route("/auth/registerMail").post(controller);
// router.route("/auth/authenticate").post(controller);
router.route("/auth/login").post(controller.login);

// Get Methods
router.route("/auth/user/:username").get(controller.getUser);
router.route("/auth/generateOTP").get(controller.generateOTP);
router.route("/auth/verifyOTP").get(controller.verifyOTP);
router.route("/auth/createResetSession").get(controller.createResetSession);

// Put Methods
router.route("/auth/user/:id").put(Auth, controller.updateUser);
router.route("/auth/resetPassword").put(controller.updateUser);

export default router;

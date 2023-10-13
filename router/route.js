import { Router } from "express";
import { RegisterMail } from "../controller/Mailer.js";
import { ategoryController } from "../controller/index.js";

import Auth from "../middleware/auth.js";
import VerifyUser from "../middleware/VerifyUser.js";
import localVariables from "../middleware/localVariables.js";
import FileUploader from "../middleware/FileUploader.js";

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

// Authentication Routes
router.route("/auth/register").post(controller.register, RegisterMail);
router.route("/auth/register-mail").post(RegisterMail);
router.route("/auth/login").post(controller.login);
router.route("/auth/verify").get(controller.verifyUser);
router.route("/auth/user/:username").get(controller.getUser);
router
  .route("/auth/generate-otp")
  .get(VerifyUser, localVariables, controller.generateOTP);
router.route("/auth/verify-otp").get(VerifyUser, controller.verifyOTP);
router.route("/auth/createResetSession").get(controller.createResetSession);
router.route("/auth/user/:id").put(Auth, controller.updateUser);
router.route("/auth/resetPassword").put(VerifyUser, controller.updateUser);

// Category Routes
router.route("/category").get(ategoryController.getCategories);
router.route("/category").post(ategoryController.createCategory);
router.route("/category/:id").patch(ategoryController.updateCategory);

router
  .route("/category/:id/thumbnail")
  .post(FileUploader.single("file"), ategoryController.updateCategoryThumbnail);

export default router;

import { Router } from "express";
import { RegisterMail } from "../controller/Mailer.js";
import { categoryController } from "../controller/index.js";

import Auth from "../middleware/auth.js";
import VerifyUser from "../middleware/VerifyUser.js";
import localVariables from "../middleware/localVariables.js";

import * as controller from "../controller/appController.js";
import ImageUploader from "../middleware/ImageUploader.js";

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
router.route("/category").get(categoryController.getCategories);
router.route("/category").post(categoryController.createCategory);
router.route("/category/:id").patch(categoryController.updateCategory);

router
  .route("/category/:id/thumbnail")
  .post(
    ImageUploader("./images/CategoryThumbnails").single("file"),
    categoryController.updateCategoryThumbnail
  );

export default router;

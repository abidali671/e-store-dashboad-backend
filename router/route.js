import { Router } from "express";
import {
  CategoryController,
  AuthController,
  MailController,
  ProductController,
} from "../controller/index.js";

import Auth from "../middleware/auth.js";
import VerifyUser from "../middleware/VerifyUser.js";
import localVariables from "../middleware/localVariables.js";
import FileUploader from "../middleware/FileUploader.js";

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
router
  .route("/auth/register")
  .post(AuthController.register, MailController.RegisterMail);
router.route("/auth/register-mail").post(MailController.RegisterMail);
router.route("/auth/login").post(AuthController.login);
router.route("/auth/verify").get(AuthController.verifyUser);
router.route("/auth/user/:username").get(AuthController.getUser);
router
  .route("/auth/generate-otp")
  .get(VerifyUser, localVariables, AuthController.generateOTP);
router.route("/auth/verify-otp").get(VerifyUser, AuthController.verifyOTP);
router.route("/auth/createResetSession").get(AuthController.createResetSession);
router.route("/auth/user/:id").put(Auth, AuthController.updateUser);
router.route("/auth/resetPassword").put(VerifyUser, AuthController.updateUser);

// Category Routes
router.route("/category").get(CategoryController.getCategories);
router.route("/category/:slug").get(CategoryController.getCategory);
router.route("/category").post(CategoryController.createCategory);
router.route("/category/:id").patch(CategoryController.updateCategory);
router
  .route("/category/:id/thumbnail")
  .post(
    FileUploader.single("file"),
    CategoryController.updateCategoryThumbnail
  );

// Product Routes
router.route("/products").get(ProductController.getProducts);
router.route("/products").post(ProductController.createProduct);

export default router;

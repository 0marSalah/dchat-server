import express from "express";
import AuthController from "../controllers/auth_controller";
import authenticateToken from "../middlewares/auth_middleware";

const router = express.Router();

router.route("/register").post(AuthController.register);

router.route("/login").post(AuthController.login);

router.route("/logout").post(authenticateToken, AuthController.logout);

router.route("/forgot-password").post(AuthController.forgotPassword);

router.route("/reset-password").post(AuthController.resetPassword);

module.exports = router;

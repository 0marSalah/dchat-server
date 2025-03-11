import fs from "node:fs";
import type { Request, Response } from "express";
import handlebars from "handlebars";
import jwt from "jsonwebtoken";
import AuthDao from "../dao/auth_dao";
import UserDao from "../dao/user-dao";
import { RegisterDto, UserLoginDto } from "../dto/auth_dto";
import { hashingPassword } from "../utils/hashing_pass";
import { sendEmail } from "../utils/send-email";
import { createToken } from "../utils/token";

enum AuthType {
  GMAIL = "gmail",
  REGULAR = "regular",
}

export default class AuthController {
  private static authDao = new AuthDao();
  private static userDao = new UserDao();

  private static createTokenAndSendResponse = async (
    req: any,
    res: Response,
    user: User,
  ) => {
    const accessToken = createToken(user, "access");
    await AuthController.authDao.updateToken(
      user.id,
      accessToken,
      "access",
      "active",
    );
    let refreshToken = null;
    if (req.body.isRemember) {
      refreshToken = createToken(user, "refresh");
      await AuthController.authDao.updateToken(
        user.id,
        refreshToken,
        "refresh",
        "active",
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 5,
    });

    req.user = {
      id: user.id,
      email: user.email,
    };

    return { accessToken, refreshToken };
  };

  static register = async (req: Request, res: Response) => {
    try {
      if (req.body.type === AuthType.REGULAR) {
        const userRegisterDto = new RegisterDto(req.body);
        userRegisterDto.password = await hashingPassword(
          userRegisterDto.password,
        );
        const newUser = await AuthController.authDao.register(userRegisterDto);

        const { accessToken, refreshToken } =
          await AuthController.createTokenAndSendResponse(req, res, newUser);

        res.status(201).json({ newUser, accessToken, refreshToken });
      } else {
        res.status(400).json({
          error: "Unsupported authentication type",
          status: "FAILURE",
        });
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      res.status(400).json({ error: error.message, status: "FAILURE" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const userLoginDto: UserLogin = new UserLoginDto(req.body);
      console.log(userLoginDto);
      const user = await AuthController.authDao.login(userLoginDto);
      const { accessToken, refreshToken } =
        await AuthController.createTokenAndSendResponse(req, res, user);

      res.status(200).json({ user, accessToken, refreshToken });
    } catch (error: any) {
      console.error("Error during login:", error);
      res.status(400).json({ error: error.message, status: "FAILURE" });
    }
  };

  static logout = async (req: any, res: Response) => {
    try {
      const user = req.user as UserRequest;
      await AuthController.authDao.updateToken(
        user.id,
        "",
        "access",
        "inactive",
      );
      await AuthController.authDao.updateToken(
        user.id,
        "",
        "refresh",
        "inactive",
      );
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res
        .status(200)
        .json({ message: "Logout successfully", status: "SUCCESS" });
    } catch (error: any) {
      console.error("Error during logout:", error);
      res.status(400).json({ error: error.message, status: "FAILURE" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const email = req.body.email;
      const user = await AuthController.userDao.getUserByEmail(email);
      if (!user) throw new Error("User not found");

      // send email

      const token = createToken(user, "reset");
      if (user.resetToken) {
        await AuthController.authDao.updateToken(
          user.id,
          token,
          "reset",
          "inactive",
        );
      }

      await AuthController.authDao.updateToken(
        user.id,
        token,
        "reset",
        "active",
      );

      const link = `http://localhost:3000/api/auth/reset-password/${user.id}/${token}`;

      const htmlTemplate = await fs.promises.readFile(
        "src/templates/reset-mail.html",
        "utf-8",
      );

      const template = handlebars.compile(htmlTemplate);

      const html = template({
        name: user.name,
        link: link,
      });

      await sendEmail(html, user.email);

      res.status(200).json({ message: "Email sent", status: "SUCCESS" });
    } catch (error: any) {
      console.error("Error during forgot password:", error);
      res.status(400).json({ error: error.message, status: "FAILURE" });
    }
  };

  static resetPassword = async (req: Request, res: Response) => {
    const { userId, token } = req.params;
    const { password } = req.body;

    try {
      const decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as { id: string; email: string };
      if (decoded.id !== userId) throw new Error("Invalid token");

      const user = await AuthController.userDao.getUserById(userId);
      if (!user) throw new Error("User not found");

      if (user.resetToken !== token || !user.resetToken)
        throw new Error("Invalid token");

      const hashedPassword = await hashingPassword(password);

      await AuthController.userDao.updateUser(user.id, {
        password: hashedPassword,
      });

      await AuthController.authDao.updateToken(
        user.id,
        token,
        "reset",
        "inactive",
      );

      res
        .status(200)
        .json({ message: "Password reset successfully", status: "SUCCESS" });
    } catch (error: any) {
      console.error("Error during reset password:", error);
      if (error.name === "TokenExpiredError")
        res.status(400).json({ error: "Token has expired", status: "FAILURE" });
      res.status(400).json({ error: error.message, status: "FAILURE" });
    }
  };
}

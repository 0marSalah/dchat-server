import { hashingPassword } from "../utils/hashing_pass";
import AuthDao from "../dao/auth_dao";
import { Request, Response } from "express";
import { createToken } from "../utils/token";
import { RegisterDto, UserLoginDto } from "../dto/auth_dto";

enum AuthType {
  GMAIL = "gmail",
  REGULAR = "regular",
}

export default class AuthController {
  private static authDao = new AuthDao();

  private static createTokenAndSendResponse = async (
    req: any,
    res: Response,
    user: User
  ) => {
    const accessToken = createToken(user, "access");
    await AuthController.authDao.updateToken(
      user.id,
      accessToken,
      "access",
      "active"
    );
    let refreshToken = null;
    if (req.body.isRemember) {
      refreshToken = createToken(user, "refresh");
      await AuthController.authDao.updateToken(
        user.id,
        refreshToken,
        "refresh",
        "active"
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
        let userRegisterDto = new RegisterDto(req.body);
        userRegisterDto.password = await hashingPassword(
          userRegisterDto.password
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
        "inactive"
      );
      await AuthController.authDao.updateToken(
        user.id,
        "",
        "refresh",
        "inactive"
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

  static forgotPassword = async (req: Request, res: Response) => {};

  static resetPassword = async (req: Request, res: Response) => {};
}

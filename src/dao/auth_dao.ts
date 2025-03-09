import prisma from "../prisma/prisma-client";
import { isPassword } from "../utils/hashing_pass";

export default class AuthDao {
  async register(data: UserRegister): Promise<User> {
    const isExisting = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (isExisting) throw new Error("User already exists");

    const newUser = await prisma.user.create({
      data: data,
    });
    return newUser;
  }

  async updateToken(
    id: string,
    token: string,
    type: string,
    state: string
  ): Promise<void> {
    if (type === "access" && state === "active") {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          accessToken: token,
        },
      });
    }

    if (type === "refresh" && state === "active") {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          refreshToken: token,
        },
      });
    }

    if (state === "inactive") {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          accessToken: null,
          refreshToken: null,
        },
      });
    }
  }

  async login(data: UserLogin): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) throw new Error("User not found");

    if (!isPassword(data.password, user.password))
      throw new Error("Password is incorrect");

    return user;
  }

  async forgotPassword() {}

  async resetPassword() {}
}

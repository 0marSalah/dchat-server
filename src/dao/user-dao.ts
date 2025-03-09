import prisma from "../prisma/prisma-client";

export default class UserDao {
  async getUserByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new Error("User not found");

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new Error("User not found");

    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return user;
  }
}

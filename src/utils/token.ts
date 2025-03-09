import jwt from "jsonwebtoken";

export const createToken = (
  userData: Partial<User>,
  type: "access" | "refresh"
) => {
  const { id, email } = userData;
  const secret =
    type === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  if (!secret) throw new Error(`${type} token secret is not defined`);

  const expiresIn = type === "access" ? "5m" : "7d";
  return jwt.sign({ id, email }, secret, {
    expiresIn: expiresIn,
  });
};

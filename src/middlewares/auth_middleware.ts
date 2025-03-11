import { type NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

const authenticateToken = (req: any, res: any, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Access token is missing', status: 'FAILURE' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as UserRequest;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res
      .status(403)
      .json({ error: 'Invalid or expired token', status: 'FAILURE' });
  }
};

export default authenticateToken;

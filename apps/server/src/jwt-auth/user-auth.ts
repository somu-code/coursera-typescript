import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userPayload } from "../custom-types/user-types";

export function generateUserJWT(userPayload: userPayload): string {
  return jwt.sign(userPayload, process.env.USER_TOKEN_SECRET!, {
    expiresIn: process.env.TOKEN_EXPIRY!,
    algorithm: "HS256",
  });
}

export async function authenticateUserJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token: string = req.cookies.userAccessToken;
  if (token) {
    jwt.verify(token, process.env.USER_TOKEN_SECRET!, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.decodedUser = decoded as decodedUser;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

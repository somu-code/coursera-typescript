import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Role, userPayload } from "../custom-types/user-types";

export function generateUserJWT(email: string) {
  const payload: userPayload = { email, role: Role.user };
  return jwt.sign(payload, process.env.USER_TOKEN_SECRET!, {
    expiresIn: process.env.TOKEN_EXPIRY!,
    algorithm: "HS256",
  });
}

export async function authenticateUserJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(req);
  const token: string = req.cookies.accessToken;
  if (token) {
    jwt.verify(token, process.env.USER_TOKEN_SECRET!, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log(decoded);
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

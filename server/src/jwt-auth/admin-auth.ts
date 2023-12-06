import jwt from "jsonwebtoken";
import { adminPayload } from "../custom-types/admin-types";
import { NextFunction, Request, Response } from "express";

export function generateAdminJWT(email: string) {
  const role = "Admin";
  const payload: adminPayload = { email, role };
  return jwt.sign(payload, process.env.ADMIN_TOKEN_SECRET!, {
    expiresIn: process.env.TOKEN_EXPIRY!,
    algorithm: "HS256",
  });
}

export async function authenticateAdminJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token: string = req.cookies.accessToken;
  if (token) {
    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET!, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.decodedAdmin = decoded as decodedAdmin;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

import jwt from "jsonwebtoken";
import { adminPayload } from "../custom-types/admin-types";

export function generateAdminJWT(email: string) {
  const role = "Admin";
  const payload: adminPayload = { email, role };
  return jwt.sign(payload, process.env.ADMIN_TOKEN_SECRET!, {
    expiresIn: process.env.TOKEN_EXPIRY!,
    algorithm: "HS256",
  });
}

const verifyToken = (token: string) => {
  const verifyTokenPromise: Promise<string> = new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err) {
        reject(err);
      }
      // resolve(decodedToken!)
    });
  });
};

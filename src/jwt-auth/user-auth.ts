import jwt from "jsonwebtoken";

export function generateUserJWT(email: string) {
  console.log(email);
  const payload = { email, role: "user" };
  console.log(payload);
  return jwt.sign(payload, process.env.USER_TOKEN_SECRET!, {
    expiresIn: process.env.TOKEN_EXPIRY!,
  });
}

// export async function authenticateUserJWT(req, res, next) {
//   const token = req.cookies.accessToken;
//   if (token) {
//     jwt.verify(token, process.env.USER_TOKEN_SECRET!, (error, user) => {
//       if (error) {
//         res.sendStatus(403);
//       } else {
//         req.user = user;
//         next();
//       }
//     });
//   } else {
//     res.sendStatus(403);
//   }
// }

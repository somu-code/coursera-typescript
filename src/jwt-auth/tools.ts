import jwt from "jsonwebtoken";


// export const JWTAuthenticate= async user=>{
import { adminPayload } from "../custom-types/user-types";

// }
export const generateJWT = (payload: adminPayload) => {
    const myPromise: Promise<string> = new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1 week" }, (err, token) => {
            if (err) {
                reject(err)
            } resolve(token!)
        })
    })
}
const verifyToken = (token: string) => {
    const verifyTokenPromise: Promise<string> = new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET!, (err, decodedToken) => {
            if (err) {
                reject(err)
            }
            //resolve(decodedToken!)
        })
    })
}





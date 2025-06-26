import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto'

dotenv.config();


export const CreateTokenToUser = (user) => {
    const secrets = process.env.TOKEN_SECRET
    const expiresDate = process.env.TOKEN_EXPIRESIN
    const paylod = {
        fullName: `${user.firstname} ${user.secoundname}`,
        email: user.email
    }
    return jwt.sign(paylod, secrets,{expiresIn:expiresDate})
}

export const CreateRefreshToken = crypto.randomBytes(64).toString("hex");
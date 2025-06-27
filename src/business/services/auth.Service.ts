import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto'
import { User } from '@prisma/client';
import { userRepositories } from '../../dataAccess/repositories/user.repository';


dotenv.config();


export const CreateTokenToUser =async (user: User) => {
    const secrets: jwt.Secret = process.env.TOKEN_SECRET || ""
    const expiresDate = process.env.TOKEN_EXPIRESIN || "15m"
    const paylod: object | string = {
        id: user.userid,
        fullName: `${user.firstname} ${user.secoundname}`,
        email: user.email,
        Role: await userRepositories.GetUserRole(user.userid)
    }
    const option: jwt.SignOptions = {
        expiresIn: expiresDate as jwt.SignOptions["expiresIn"],
    }
    return jwt.sign(paylod, secrets, option)
}

export const CreateRefreshToken = crypto.randomBytes(64).toString("hex");
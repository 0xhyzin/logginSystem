import { Prisma, User, usertoken } from '@prisma/client';
import { prisma } from '../database/db.js'
import { generateOTP } from '../utilities/helpers.js';

class UserRepositories {
    public AddUserToDatabase = async (user: User) => {
        let addUser: User;
        try {
            addUser = await prisma.user.create({
                data: {
                    firstname: user.firstname,
                    secoundname: user.secoundname,
                    email: user.email,
                    phone: user.phone,
                    hashPassword: user.hashPassword
                },
            })
            if (addUser === null) {
                throw Error("Error When add User To database");
            }
            const newUserRole = await prisma.userrole.create({
                data: {
                    roletypeid: 2,
                    userid: addUser.userid
                }
            })
            if (newUserRole === null) {
                throw Error("Error When add Role To user");
            }
        } catch (er) {
            console.log(er)
            return null;
        }
        return addUser;

    }
    public AddRefreshTokenToUser = async (userId: number, refreshToken: string) => {
        const now = new Date();
        const expireDate = new Date(now);
        expireDate.setMonth(expireDate.getMonth() + 1);
        try {
            const token = await prisma.usertoken.create({
                data: {
                    token: refreshToken,
                    tokentypeid: 1,
                    createdate: now,
                    expiredate: expireDate,
                    userid: userId,
                    isused: false
                }
            })
            if (token === null) {
                throw Error("Error When add RefreshToken");
            }
        } catch (er) {
            console.log(er)
            return false;
        }
        return true;
    }
    public GetUserRole = async (userId: number) => {
        const roles = await prisma.userrole.findMany({
            where: { userid: userId },
            include: {
                roletype: {
                    select: {
                        rolename: true
                    }
                }
            }
        })
        return roles.map(role => role.roletype?.rolename)
    }

    public GetUserByEmail = async (email: string) => {
        let user;
        try {
            user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
            if (user === null) {
                throw Error("Email not found")
            }
        } catch (er) {
            console.log(er)
            return null;
        }
        return user;
    }
    public GetUserByRefreshToken = async (refreshTocken: string) => {
        let user;
        try {
            const tokenRecourd = await prisma.usertoken.findUnique({
                where: {
                    token: refreshTocken,
                    isused: false,
                    expiredate: {
                        gt: new Date()
                    }
                },
                include: {
                    User: true
                }
            })
            if (tokenRecourd === null) {
                throw Error("Invalid or expired refresh token")
            }
            user = tokenRecourd?.User;

        } catch (er) {
            console.log(er)
            return null;
        }
        return user;
    }
    public MakePrevRefreshTokenIsUsed = async (user: User) => {
        try {
            const tokenRecourd = await prisma.usertoken.deleteMany({
                where: {
                    userid: user.userid,
                    tokentypeid: 1
                },
            })
        } catch (er) {
            console.log(er);
        }
    }
    public GetConfirmEmailToken = async (email: string) => {
        const now = new Date();
        const expireDate = new Date(now);
        expireDate.setMonth(expireDate.getMinutes() + 10);
        const user: User | null = await this.GetUserByEmail(email);
        if (user === null) {
            return null;
        }
        let otpToken;
        try {
            const tokenNumber: usertoken = await prisma.usertoken.create({
                data: {
                    token: generateOTP(),
                    createdate: now,
                    expiredate: expireDate,
                    tokentypeid: 2,
                    userid: user.userid,
                    isused: false
                }
            })
            otpToken = tokenNumber.token;
        } catch (er) {
            console.log(er);
            return 0;
        }
        return Number(otpToken);
    }
    public CheckOtpCodeForUser = async (otpCode: Number, user: User) => {
        try {
            const userOtp = await prisma.usertoken.findUnique({
                where: {
                    token: otpCode.toString(),
                    isused: false,
                    expiredate: {
                        gt: new Date()
                    }
                }
            })
            if(userOtp ===null){
                throw Error ("Token Not Found")
            }
        }catch(er){
            console.log(er);
            return false;
        }
        await prisma.user.update({
            where:{
                email:user.email,
            },
            data:{
                isactive:true
            }
        })
        return true;
    }
}
export const userRepositories = new UserRepositories();
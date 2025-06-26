import { prisma } from '../database/db.js'

class UserRepositories {
    AddUserToDatabase = (userDto) => {
        let user;
        try {
            user = prisma.user.create({
                data: {
                    firstname: userDto.firstName,
                    secoundname: userDto.secoundName,
                    email: userDto.email,
                    phone: userDto.phone,
                    hashPassword: userDto.password
                },
            })
            if (user === null) {
                throw Error("Error When add User To database");
            }
            const newUserRole = prisma.userrole.create({
                data: {
                    roleid: 2,
                    userid: user.userid
                }
            })
            if (newUserRole === null) {
                throw Error("Error When add Role To user");
            }
        } catch (er) {
            console.log(er)
            return null;
        }
        return user;

    }
    AddRefreshTokenToUser = (userId, refreshToken) => {
        const now = new Date();
        try {
            const token = prisma.usertoken.create({
                data: {
                    token: refreshToken,
                    tokentypeid: 1,
                    createdate: now,
                    expiredate: now.setMonth(now.getMonth() + 1),
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
}
export const userRepositories = new UserRepositories();
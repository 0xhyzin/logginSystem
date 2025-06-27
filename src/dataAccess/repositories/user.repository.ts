import { Prisma, User } from '@prisma/client';
import { prisma } from '../database/db.js'

class UserRepositories {
    public AddUserToDatabase =async (user : User) => {
        let addUser:User ;
        try {
            addUser =await prisma.user.create({
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
            const newUserRole =await prisma.userrole.create({
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
    public AddRefreshTokenToUser =async (userId :number, refreshToken :string) => {
        const now = new Date();
        const expireDate = new Date(now);
        expireDate.setMonth(expireDate.getMonth() + 1); 
        try {
            const token =await prisma.usertoken.create({
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
    public GetUserRole =async (userId:number)=>{
        const roles = await prisma.userrole.findMany({
            where: { userid: userId },
            include:{
                roletype:{
                    select:{
                        rolename:true
                    }
                }
            }
        })
        return roles.map(role=>role.roletype?.rolename)
    }
}
export const userRepositories = new UserRepositories();
import { User } from "@prisma/client";
import { userRepositories } from "../../dataAccess/repositories/user.repository.js";
import { UserDto } from "../dtos/UserDto.js";
import { ServicesHandler } from "../ServicesHandler.js";
import { ToUserDto } from "../utilities/mappers/UserMapper.js";
import { CreateRefreshToken, CreateTokenToUser } from "./auth.Service.js";
import { CreateUserDto } from "../dtos/CreateUserDto.js";
import { LoginUserDto } from "../dtos/LoginUserDto.js";
import dotenv from "dotenv"
import nodemailer from 'nodemailer';
import { SendEmailOptions } from "../utilities/hellpers/SendEmailOption.js";

dotenv.config();


class UserServices {
    public CreateNewUser = async (createUserDto: CreateUserDto) => {

        const handler: ServicesHandler<UserDto | null> = new ServicesHandler();

        const user: User = {
            userid: 0,
            firstname: createUserDto.firstName,
            secoundname: createUserDto.secoundName,
            email: createUserDto.email,
            isactive: false,
            phone: createUserDto.phone,
            hashPassword: createUserDto.password
        }

        const addUser: User | null = await userRepositories.AddUserToDatabase(user)
        if (addUser === null) {
            handler.message = "Error When add User";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;

        }
        const UserToken = await CreateTokenToUser(addUser);
        const refreshToken = CreateRefreshToken();

        const isAddRefrsh = await userRepositories.AddRefreshTokenToUser(addUser.userid, refreshToken);
        if (!isAddRefrsh) {
            handler.message = "Error When add Refresh Token";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }


        handler.message = "User Add Successfuly";
        handler.isSuccss = true;
        handler.dto = ToUserDto(addUser, UserToken);
        handler.refreshToken = refreshToken
        return handler;
    }
    public LoginUser = async (loginUserDto: LoginUserDto) => {
        const handler: ServicesHandler<UserDto | null> = new ServicesHandler();

        const user: User | null = await userRepositories.GetUserByEmail(loginUserDto.email);

        if (user === null) {
            handler.message = "Somthing wrong in email or password";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }
        if (!user.isactive) {
            handler.message = "Confirm Email First (check Your Email)";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }

        await userRepositories.MakePrevRefreshTokenIsUsed(user);
        if (user.hashPassword !== loginUserDto.password) {
            handler.message = "Somthing wrong in email or password";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }
        const UserToken = await CreateTokenToUser(user);
        const refreshToken = CreateRefreshToken();

        const isAddRefrsh = await userRepositories.AddRefreshTokenToUser(user.userid, refreshToken);
        if (!isAddRefrsh) {
            handler.message = "Error When add Refresh Token";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }

        handler.message = "User login succssefuly";
        handler.isSuccss = true;
        handler.dto = ToUserDto(user, UserToken);
        handler.refreshToken = refreshToken
        return handler;

    }
    public GetUserByRefreshToken = async (refreshTocken: string) => {
        const handler: ServicesHandler<UserDto | null> = new ServicesHandler();

        const user: User | null = await userRepositories.GetUserByRefreshToken(refreshTocken);

        if (user === null) {
            handler.message = "Somthing wrong User Not Found";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }

        const UserToken = await CreateTokenToUser(user);
        if (UserToken == null) {
            handler.message = "Somthing wrong ";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }

        handler.message = "User Found";
        handler.isSuccss = true;
        handler.dto = ToUserDto(user, UserToken);
        handler.refreshToken = null;
        return handler;
    }
    public SendConfirmTokenToEmail = async (email: string) => {
        const handler: ServicesHandler<boolean> = new ServicesHandler();

        const token: number | null = await userRepositories.GetConfirmEmailToken(email);
        if (token === 0) {
            handler.message = "try latter";
            handler.isSuccss = false;
            handler.dto = false;
            handler.refreshToken = null
            return handler;
        }

        const transPorter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_APP_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD
            }
        })
        const htmlForm = `
  <div style="font-family: Arial, sans-serif; padding: 10px;">
    <h2>Welcome to our platform 👋</h2>
    <p>Thank you for signing up! To confirm your account, please use the following verification code:</p>
    <h3 style="color: #2c3e50;">${token}</h3>
    <p>This code is valid for 10 minutes only.</p>
    <p>If you did not request this code, please ignore this message.</p>
    <hr />
    <small>Best regards,<br />Support Team</small>
  </div>
`
        try {
            const message: SendEmailOptions = {
                subject: "Confirm your account - Verification Code",
                to: email,
                html: htmlForm
            }
            await transPorter.sendMail(message)
        } catch (er) {
            handler.message = "Error sending email";
            handler.isSuccss = false;
            handler.dto = false;
            handler.refreshToken = null
            return handler;
        }

        handler.message = "Email sent";
        handler.isSuccss = true;
        handler.dto = true;
        handler.refreshToken = null
        return handler;
    }
    public CheckOtpCode = async (otpCode: Number, email: string) => {
        const handler: ServicesHandler<UserDto> = new ServicesHandler();

        const user: User | null = await userRepositories.GetUserByEmail(email);
        if (user === null) {
            handler.message = "user Not Found";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }
        const isOtpTrue: boolean = await userRepositories.CheckOtpCodeForUser(otpCode, user)
        if (!isOtpTrue) {
            handler.message = "Otp Wrong";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }


        const UserToken = await CreateTokenToUser(user);
        const refreshToken = CreateRefreshToken();

        const isAddRefrsh = await userRepositories.AddRefreshTokenToUser(user.userid, refreshToken);
        if (!isAddRefrsh) {
            handler.message = "Error When add Refresh Token";
            handler.isSuccss = false;
            handler.dto = null;
            handler.refreshToken = null
            return handler;
        }

        handler.message = "email confirm succssfuly";
        handler.isSuccss = true;
        handler.dto = ToUserDto(user, UserToken);
        handler.refreshToken = refreshToken
        return handler;

    }
}
export const userServices = new UserServices();

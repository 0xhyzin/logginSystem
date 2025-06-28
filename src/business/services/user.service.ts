import { User } from "@prisma/client";
import { userRepositories } from "../../dataAccess/repositories/user.repository.js";
import { UserDto } from "../dtos/UserDto.js";
import { ServicesHandler } from "../ServicesHandler.js";
import { ToUserDto } from "../utilities/mappers/UserMapper.js";
import { CreateRefreshToken, CreateTokenToUser } from "./auth.Service.js";
import { CreateUserDto } from "../dtos/CreateUserDto.js";
import { LoginUserDto } from "../dtos/LoginUserDto.js";


class UserServices {
    public CreateNewUser = async (createUserDto: CreateUserDto) => {

        const handler: ServicesHandler<UserDto | null> = new ServicesHandler();

        const user: User = {
            userid: 0,
            firstname: createUserDto.firstName,
            secoundname: createUserDto.secoundName,
            email: createUserDto.email,
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
}
export const userServices = new UserServices();

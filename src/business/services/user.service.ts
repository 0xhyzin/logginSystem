import { User } from "@prisma/client";
import { userRepositories } from "../../dataAccess/repositories/user.repository.js";
import { UserDto } from "../dtos/UserDto.js";
import { ServicesHandler } from "../ServicesHandler.js";
import { ToUserDto } from "../utilities/mappers/UserMapper.js";
import { CreateRefreshToken, CreateTokenToUser } from "./auth.Service.js";
import { CreateUserDto } from "../dtos/CreateUserDto.js";


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
        const UserToken =await CreateTokenToUser(addUser);
        const refreshToken = CreateRefreshToken;

        const isAddRefrsh =await userRepositories.AddRefreshTokenToUser(addUser.userid, refreshToken);
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
}
export const userServices = new UserServices();

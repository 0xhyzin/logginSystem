import { userRepositories } from "../../dataAccess/repositories/user.repository.js";
import { ToUserDto } from "../utilities/mappers/UserMapper.js";
import { CreateRefreshToken, CreateTokenToUser } from "./auth.Service.js";


class UserServices {
    CreateNewUser =  (createUserDto) => {

        const user =  userRepositories.AddUserToDatabase(createUserDto)
        if (user === null) {
            return null;
        }
        const UserToken = CreateTokenToUser(user);
        const refreshToken = CreateRefreshToken;

        const isAddRefrsh = userRepositories.AddRefreshTokenToUser(user.userId, refreshToken);
        if (!isAddRefrsh) {
            return null;
        }


        return {
            userDto: ToUserDto(user, UserToken),
            refresh: refreshToken
        };
    }
}
export const userServices = new UserServices();

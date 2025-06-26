import { UserDto } from "../../dtos/UserDto.js"

export const ToUserDto = (user, token) => {
    return new UserDto(user.firstname, user.secoundname, user.email, token);
}
import { User } from "@prisma/client"
import { UserDto } from "../../dtos/UserDto.js"

export const ToUserDto = (user: User, token: string): UserDto => {
    return {
        fullName: `${user.firstname} ${user.secoundname}`,
        email: user.email,
        token: token
    }
}
import { Request, Response } from "express"
import { CreateUserDto } from "../../business/dtos/CreateUserDto.js"
import { userServices } from "../../business/services/user.service.js"
import { UserDto } from "../../business/dtos/UserDto.js"
import { ServicesHandler } from "../../business/ServicesHandler.js"

export const LoginUser =async (req:Request, res:Response) => {

}

export const CreatUser =async (req: Request, res: Response) => {
    const { firstName, secoundName, email, phone, password }: {
        firstName: string;
        secoundName: string;
        email: string;
        phone: string;
        password: string;
    } = req.body;

    const createUserDto: CreateUserDto = {
        firstName: firstName,
        secoundName: secoundName,
        email: email,
        phone: phone,
        password: password,
    };

    const response: ServicesHandler<UserDto | null> =await userServices.CreateNewUser(createUserDto);

    if (response.dto === null || response.refreshToken === null) {
        res.status(404).send("Error 404");
    }
    res.cookie("refreshTocken", response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })


    return res.status(201).send({ message: "User Create Succssesfuly", user: response.dto })

}
export const UpdateUser = (req:Request, res:Response) => {

}
export const DeleteUser = (req:Request, res:Response) => {

}
import e, { Request, Response } from "express"
import { CreateUserDto } from "../../business/dtos/CreateUserDto.js"
import { userServices } from "../../business/services/user.service.js"
import { UserDto } from "../../business/dtos/UserDto.js"
import { ServicesHandler } from "../../business/ServicesHandler.js"
import { LoginUserDto } from "../../business/dtos/LoginUserDto.js"

export const LoginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const loginUserDto: LoginUserDto = {
        email: email,
        password: password
    };
    const response: ServicesHandler<UserDto | null> = await userServices.LoginUser(loginUserDto);

    if (response.dto === null || response.refreshToken === null) {
        res.status(404).send({ message: response.message, statusCode: 404 });
    }
    res.cookie("refreshTocken", response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    }).status(200).send({ message: response.message, user: response.dto })
}

export const CreatUser = async (req: Request, res: Response) => {
    const { firstName, secoundName, email, phone, password } = req.body;

    const createUserDto: CreateUserDto = {
        firstName: firstName,
        secoundName: secoundName,
        email: email,
        phone: phone,
        password: password,
    };

    const response: ServicesHandler<UserDto | null> = await userServices.CreateNewUser(createUserDto);

    if (response.dto === null || response.refreshToken === null) {
        res.status(404).send({ message: response.message, statusCode: 404 });
    }
    res.cookie("refreshTocken", response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    }).status(201).send({ message: response.message, user: response.dto })

}
export const RefreshAuth = async (req: Request, res: Response) => {
    const refreshTocken = req.cookies.refreshToken
    const response: ServicesHandler<UserDto | null> = await userServices.GetUserByRefreshToken(refreshTocken);
    if (response.dto === null) {
        res.status(404).send({ message: response.message, statusCode: 404 });
    }
    res.status(200).send({ message: response.message, user: response.dto })
}

export const SendConfirmEmailToken = async (req: Request, res: Response) => {
    const email = req.body.email;
    const response: ServicesHandler<boolean> = await userServices.SendConfirmTokenToEmail(email);

    if (!response.dto) {
        res.status(404).send({ message: response.message, statusCode: 404 });
    }
    res.status(200).send({ message: response.message, user: response.dto })
}

export const CheckConfirmEmailCode = async (req: Request, res: Response) => {
    const otpCode: number = Number(req.body.otpCode);
    const email = req.body.email;

    const response = await userServices.CheckOtpCode(otpCode,email);

    if (!response.dto) {
        res.status(404).send({ message: response.message, statusCode: 404 });
    }
    res.status(200).send({ message: response.message, user: response.dto })

}
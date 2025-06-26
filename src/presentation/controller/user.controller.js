import { request, response } from "express"
import { CreateUserDto } from "../../business/dtos/CreateUserDto.js"
import { userServices } from "../../business/services/user.service.js"

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const LoginUser = (req, res) => {

}
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const CreatUser =  (req, res) => {
    const { firstName, secoundName, email, phone, password } = req.body;
    const createUserDto = new CreateUserDto(firstName, secoundName, email, phone, password);

    const {userDto, refresh} =  userServices.CreateNewUser(createUserDto);
    if (userDto === null || refresh === null) {
        res.status(404).send("Error 404");
    }
    res.cookie("refreshTocken", refresh, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })


    res.status(201).send({ message: "User Create Succssesfuly", user: userDto })

}
export const UpdateUser = (req, res) => {

}
export const DeleteUser = (req, res) => {

}
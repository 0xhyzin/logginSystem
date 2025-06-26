import { Router } from "express";
import { ValidationCreateUser } from "../middlewares/validation/UserValidation.js";
import { LoginUser, CreatUser, UpdateUser, DeleteUser } from "../controller/user.controller.js";

export const UserRout = Router();

UserRout.post('/userlogin', LoginUser);
UserRout.post('/creataccount/',ValidationCreateUser, CreatUser);
UserRout.put('/', UpdateUser);
UserRout.delete('/', DeleteUser);
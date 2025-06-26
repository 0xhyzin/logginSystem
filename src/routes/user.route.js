import { Router } from "express";
import { LoginUser, CreatUser, UpdateUser, DeleteUser } from "../controller/user.controller.js";

export const UserRout = Router();

UserRout.post('/', LoginUser);
UserRout.post('/', CreatUser);
UserRout.put('/', UpdateUser);
UserRout.delete('/', DeleteUser);
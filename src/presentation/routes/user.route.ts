import { Router } from "express";
import { ValidationCreateUser, ValidationLoginUser, ValidationrefReshTockenUser } from "../middlewares/validation/UserValidation.js";
import { LoginUser, CreatUser, UpdateUser, DeleteUser, RefreshAuth } from "../controller/user.controller.js";

export const UserRout: Router = Router();

UserRout.post('/login', ValidationLoginUser, LoginUser);
UserRout.post('/creataccount/', ValidationCreateUser, CreatUser);
UserRout.get('/refresh',ValidationrefReshTockenUser,RefreshAuth)
UserRout.put('/', UpdateUser);
UserRout.delete('/', DeleteUser);
import { Router } from "express";
import { ValidationCreateUser, ValidationLoginUser, ValidationrefReshTockenUser } from "../middlewares/validation/UserValidation.js";
import { LoginUser, CreatUser, UpdateUser, DeleteUser, RefreshAuth, SendConfirmEmailToken,CheckConfirmEmailCode } from "../controller/user.controller.js";

export const UserRout: Router = Router();

UserRout.post('/login', ValidationLoginUser, LoginUser);
UserRout.post('/creataccount/', ValidationCreateUser, CreatUser);
UserRout.get('/refresh', ValidationrefReshTockenUser, RefreshAuth)
UserRout.post('/sendconfirmemailtokent', SendConfirmEmailToken)
UserRout.post('/checkconfirmtoken',CheckConfirmEmailCode)
UserRout.put('/', UpdateUser);
UserRout.delete('/', DeleteUser);
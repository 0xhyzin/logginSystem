import express, { json ,Express } from "express";
import { UserRout } from "./presentation/routes/user.route.js";
import cookieParser from "cookie-parser";

export const app :Express = express();

app.use(json());
app.use(cookieParser());

app.use('/api/user',UserRout);

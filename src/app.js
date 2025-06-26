import express, { json } from "express";
import { UserRout } from "./presentation/routes/userRout.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(json());
app.use(cookieParser());

app.use('/api/user',UserRout);

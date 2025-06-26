import express from "express";
import { UserRout } from "./routes/user.route.js";

export const app = express();

app.use('/api/user',UserRout);

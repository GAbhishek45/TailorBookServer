import express from "express";
import { loginController,registerController } from './../Controllers/userControllers.js';

export const userRouter = express.Router();

userRouter.post('/login',loginController)
userRouter.post('/register',registerController)



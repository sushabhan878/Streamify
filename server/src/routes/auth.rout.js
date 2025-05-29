import express from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signin", signin);

authRouter.post("/signup", signup);

authRouter.post("/signout", signout);

export default authRouter;

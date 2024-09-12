import { Router } from "express";
import { create, login } from "src/controllers/auth";

const authRouter = Router()

authRouter.post('/create', create)
authRouter.post('/sigin', login)

export default authRouter; 
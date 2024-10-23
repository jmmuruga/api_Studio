import { Router } from "express";
import { login } from "./loginModule.service";

const loginModuleRouter = Router();
loginModuleRouter.post('/login/:e_mail/:password', (req, res) => login(req, res));
export default loginModuleRouter;
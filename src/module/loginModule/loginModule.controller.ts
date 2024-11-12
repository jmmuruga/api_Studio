import { Router } from "express";
import { forgotPassword, login } from "./loginModule.service";

const loginModuleRouter = Router();
loginModuleRouter.post('/login/:e_mail/:password', (req, res) => login(req, res));
loginModuleRouter.post('/forgotPassword/:e_mail', (req, res) => forgotPassword(req, res));
export default loginModuleRouter;
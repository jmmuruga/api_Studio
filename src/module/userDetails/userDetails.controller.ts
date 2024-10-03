import { Router } from "express";
import { getUserList, newUser } from "./userDetails.service";
const userDetailRouter = Router();
userDetailRouter.get('/getuserList', (req, res) => getUserList(req, res));
userDetailRouter.post('/newUser', (req, res) => newUser(req, res));
export default userDetailRouter;
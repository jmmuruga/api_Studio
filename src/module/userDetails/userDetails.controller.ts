import { Router } from "express";
import { deleteUser, getUserList, newUser } from "./userDetails.service";
const userDetailRouter = Router();
userDetailRouter.get('/getuserList', (req, res) => getUserList(req, res));
userDetailRouter.post('/newUser', (req, res) => newUser(req, res));
userDetailRouter.delete('/deleteuser/:userid', (req, res) => deleteUser(req, res));
export default userDetailRouter;
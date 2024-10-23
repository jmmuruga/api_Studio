import { Router } from "express";
import { deleteUser, getUserList, newUser } from "./userDetails.service";
import { auth } from "../../shared/helper";
const userDetailRouter = Router();
userDetailRouter.get('/getuserList', auth, (req, res) => getUserList(req, res));
userDetailRouter.post('/newUser', auth, (req, res) => newUser(req, res));
userDetailRouter.delete('/deleteuser/:userid', auth, (req, res) => deleteUser(req, res));
export default userDetailRouter;
import { Router } from "express";
import { auth } from "../../shared/helper";
import { deleteCompany, getCompanyList, newCompany } from "./companyDetails.service";
const companyDetailRouter = Router();
companyDetailRouter.get('/getCompanyList', auth, (req, res) => getCompanyList(req, res));
companyDetailRouter.post('/newCompany', auth, (req, res) => newCompany(req, res));
companyDetailRouter.delete('/deleteCompany/:companyid', auth, (req, res) => deleteCompany(req, res));
export default companyDetailRouter;
import "reflect-metadata";
import dotenv from 'dotenv';
import express from 'express';
import "./core/db";
import cors from "cors";
import userDetailRouter from "./module/userDetails/userDetails.controller";
import galleryRouter from "./module/gallery/gallery.controller";
import bannerRouter from "./module/banner/banner.controller";
import userThemeRouter from "./module/userTheme/userTheme.controller";
import loginModuleRouter from "./module/loginModule/loginModule.controller";
import companyDetailRouter from "./module/company/companyDetails.controller";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: "50mb" }));
app.use(cors());
let corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use('/userDetailsRouter', cors(corsOptions), userDetailRouter);
app.use('/companyDetailRouter', cors(corsOptions), companyDetailRouter);
app.use('/galleryMasterRouter', cors(corsOptions), galleryRouter);
app.use('/bannerMasterRouter', cors(corsOptions), bannerRouter);
app.use('/userThemeRouter', cors(corsOptions), userThemeRouter);
app.use('/loginModuleRouter', cors(corsOptions), loginModuleRouter);
app.listen(PORT, () => console.log(`server upon port ${PORT}`));
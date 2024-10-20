import { Router } from "express";
import { deleteGalary, deletePermanantlyGallery, deletePermanantlyGalleryNested, getDeletedGalleryMaster, getDeletedGalleryMasterNested, getGalleryList, getGalleryMasterNestedList, newGallery, restoreDeleteGalary, restoreDeleteGalaryNested } from "./gallery.service";

const galleryRouter = Router();
galleryRouter.post('/newGallery', (req, res) => newGallery(req, res));
galleryRouter.get('/getGalleryList', (req, res) => getGalleryList(req, res));
galleryRouter.get('/getGalleryMasterNestedList/:albumid', (req, res) => getGalleryMasterNestedList(req, res));
galleryRouter.delete('/deleteGalary/:albumid', (req, res) => deleteGalary(req, res));
galleryRouter.get('/getDeletedGalleryMaster', (req, res) => getDeletedGalleryMaster(req, res));
galleryRouter.get('/getDeletedGalleryMasterNested', (req, res) => getDeletedGalleryMasterNested(req, res));
galleryRouter.delete('/deletePermanantlyGallery/:albumid', (req, res) => deletePermanantlyGallery(req, res));
galleryRouter.put('/restoreDeleteGalary/:albumid', (req, res) => restoreDeleteGalary(req, res));
galleryRouter.delete('/deletePermanantlyGalleryNested/:photoid', (req, res) => deletePermanantlyGalleryNested(req, res));
galleryRouter.put('/restoreDeleteGalaryNested/:photoid', (req, res) => restoreDeleteGalaryNested(req, res));
export default galleryRouter;
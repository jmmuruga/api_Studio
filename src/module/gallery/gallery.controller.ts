import { Router } from "express";
import { addMorePhoto, changeIndex, changeStatus, deleteGalary, deletePermanantlyGallery, deletePermanantlyGalleryNested, deletePhoto, getAlbumPhotos, getDeletedGalleryMaster, getDeletedGalleryMasterNested, getGalleryList, getGalleryMasterNestedList, newGallery, restoreDeleteGalary, restoreDeleteGalaryNested } from "./gallery.service";
import { auth } from "../../shared/helper";

const galleryRouter = Router();
galleryRouter.post('/newGallery', auth, (req, res) => newGallery(req, res));
galleryRouter.get('/getGalleryList', auth, (req, res) => getGalleryList(req, res));
galleryRouter.get('/getGalleryMasterNestedList/:albumid', auth, (req, res) => getGalleryMasterNestedList(req, res));
galleryRouter.delete('/deleteGalary/:albumid/:cuid', auth, (req, res) => deleteGalary(req, res));
galleryRouter.get('/getDeletedGalleryMaster', auth, (req, res) => getDeletedGalleryMaster(req, res));
galleryRouter.get('/getDeletedGalleryMasterNested', auth, (req, res) => getDeletedGalleryMasterNested(req, res));
galleryRouter.delete('/deletePermanantlyGallery/:albumid', auth, (req, res) => deletePermanantlyGallery(req, res));
galleryRouter.put('/restoreDeleteGalary/:albumid/:cuid', auth, (req, res) => restoreDeleteGalary(req, res));
galleryRouter.delete('/deletePermanantlyGalleryNested/:photoid', auth, (req, res) => deletePermanantlyGalleryNested(req, res));
galleryRouter.put('/restoreDeleteGalaryNested/:photoid/:cuid', auth, (req, res) => restoreDeleteGalaryNested(req, res));
galleryRouter.post('/addMorePhoto', auth, (req, res) => addMorePhoto(req, res));
galleryRouter.get('/getAlbumPhotos/:albumid/:count', auth, (req, res) => getAlbumPhotos(req, res));
galleryRouter.put('/deletePhoto/:photoid/:cuid', auth, (req, res) => deletePhoto(req, res));
galleryRouter.put('/changeStatus/:status/:albumid/:cuid', auth, (req, res) => changeStatus(req, res));
galleryRouter.post('/changeIndex', auth, (req, res) => changeIndex(req, res));
export default galleryRouter;
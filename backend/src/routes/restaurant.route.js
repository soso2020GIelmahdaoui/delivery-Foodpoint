import express from 'express';
import upload from '../middlewares/multer.js';
import { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant } from '../controllers/restaurant.controller.js';


const router = express.Router();

router.post('/createRestaurant', upload.single('image'), createRestaurant);
router.get('/getRestaurants', getRestaurants);
router.get('/getRestaurantById/:id', getRestaurantById);
router.put('/updateRestaurant/:id', upload.single('image'), updateRestaurant);
router.delete('/deleteRestaurant/:id', deleteRestaurant);

export default router;

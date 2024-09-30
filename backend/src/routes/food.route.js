import express from 'express';
import upload from "../middlewares/multer.js";

import { createFood, getFoodById, getFoods, updateFood, deleteFood } from '../controllers/food.controller.js';


const router = express.Router();
router.post('/createFood', upload.single('image'), createFood)
router.get('/getFoods', getFoods)
router.get('/getFoodById/:id', getFoodById)
router.put('/updateFood/:id',upload.single('image'), updateFood)
router.delete('/deleteFood/:id', deleteFood)

export default router;
import express from 'express';

import { createCart, getCarts, getCartById, updateCart, deleteCart } from '../controllers/cart.controller.js';

const router = express.Router();
router.post('/createcart', createCart)
router.get('/getcarts', getCarts)
router.get('/getCartById/:id', getCartById)
router.put('/updateCart', updateCart)
router.delete('/deleteCart', deleteCart)

export default router;


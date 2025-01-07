const express = require('express');
const { addToCart, getCartItems, updateCart, deleteItemFromCart} = require('../controllers/cartController');

const router = express.Router();

router.post('/add', addToCart);
router.get('/', getCartItems);
router.put('/update', updateCart);
router.delete('/delete', deleteItemFromCart);



module.exports = router;

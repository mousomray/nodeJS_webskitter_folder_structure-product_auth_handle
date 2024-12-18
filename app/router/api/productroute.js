const express = require('express');
const routeLabel = require('route-label');
const productController = require('../../webservice/productApiController');
const { UserAuth } = require('../../middleware/user_auth/auth')

// Initiallize the express router for router object
const router = express.Router();
const namedRouter = routeLabel(router);

namedRouter.get('products', '/products', UserAuth, productController.showproduct)
namedRouter.get('categories', '/products/categories', UserAuth, productController.showCategories)
namedRouter.get('categorydetails', '/products/category/:category', UserAuth, productController.categorydetails)
namedRouter.get('search', '/products/search', UserAuth, productController.search)
namedRouter.post('addcart', '/addcart', UserAuth, productController.addToCart)
namedRouter.get('cart', '/cart/:userId', UserAuth, productController.getCart)
namedRouter.put('lesscart', '/lesscart', UserAuth, productController.lessCart)

module.exports = router;  
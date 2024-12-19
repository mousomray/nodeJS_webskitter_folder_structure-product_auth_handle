const ProductModel = require('../model/product');
const CartModel = require('../model/cart');

class ProductRepo {

    // Add product function
    async createProduct(productData) {
        return ProductModel.create(productData)
    }

    // All products function for admin pannel
    async allProducts() {
        return await ProductModel.find();
    }

    // Fetch product for api and use filter parameter for search 
    async getActiveProducts(filter) {
        return await ProductModel.find({ active: true, ...filter });
    }

    // Fetch single product
    async oneProduct(id) {
        return await ProductModel.findById(id);
    }

    // Update product 
    async updateproduct(id, productData) {
        return await ProductModel.findByIdAndUpdate(id, productData)
    }

    // Delete product 
    async deleteproduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }

    // Fetch category list
    async fetchCategory() {
        return await ProductModel.distinct("category");
    }

    // Find by category 
    async categoryDetails(categoryRegex) {
        return await ProductModel.find({ category: categoryRegex });
    }

    /** Handle add to cart area */

    // Find cart by userId
    async findCartByuserId(userId) {
        return await CartModel.findOne({ userId });
    }

    // Create cart
    async createCart(userId, products) {
        return await CartModel.create({ userId, products });
    }

    // Save cart item into the database
    async updateCart(cart) {
        return await cart.save();
    }

    // Find cart and populate
    async findCartandPopulate(userId) {
        return await CartModel.findOne({ userId }).populate(
            'products.productId',
            'title price image description category'
        );
    }

}

module.exports = new ProductRepo(); 

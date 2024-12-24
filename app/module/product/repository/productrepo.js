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

    // Fetch product for api where I add pagination
    async getActiveProducts(page, limit) {
        const skip = (page - 1) * limit;
        return await ProductModel.find({ active: true }).skip(skip).limit(limit);
    }

    // Get search product with query parameter
    async getSearchProduct(filter) {
        return await ProductModel.find({ active: true, ...filter })
    }

    // Get search with post data show by sir
    async postSearchProduct(search) {
        const query = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ],
            active: true
        };
        return await ProductModel.find(query); 
    }

    // Total product 
    async countProduct() {
        return await ProductModel.countDocuments({ active: true });
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
        return await ProductModel.find({ active: true, category: categoryRegex });
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

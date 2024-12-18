const ProductRepo = require('../module/product/repository/productrepo')

class productApiController {

    // Product list
    async showproduct(req, res) { 
        try {
            const products = await ProductRepo.getActiveProducts();
            res.status(200).json({ succes: true, message: "Product data retrive sucessfully", products, total: products.length });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving products" });
        }
    }

    // Brand List API
    async showCategories(req, res) {
        try {
            const categories = await ProductRepo.fetchCategory();
            const categoryData = categories.map((category) => ({
                slug: category.toLowerCase().replace(/\s+/g, '-'),
                name: category,
                url: `/api/products/category/${category.toLowerCase().replace(/\s+/g, '-')}`
            }));
            res.json(categoryData);
        } catch (error) {
            console.error("Error fetching categories:", error);
            res.status(500).json({ message: "Error fetching categories" });
        }
    }

    // Single Category
    async categorydetails(req, res) {
        const category = req.params.category;
        try {
            const regex = new RegExp(`^${category.replace(/-/g, ' ')}`, 'i');
            const products = await ProductRepo.categoryDetails(regex);
            res.json({
                success: true,
                message: `Found ${products.length} products for category "${category}"`,
                totalProducts: products.length,
                products,
            });
        } catch (error) {
            console.error("Error fetching products by category:", error);
            res.status(500).json({ success: false, message: "Error retrieving products" });
        }
    }

    // Search API for filtering products by name
    async search(req, res) {
        const { title } = req.query;
        const filter = {};
        if (title) {
            filter.title = { $regex: new RegExp(title, 'i') };
        }
        try {
            const products = await ProductRepo.getActiveProducts(filter);
            res.status(200).json({
                message: 'Search products retrieved successfully',
                total: products.length,
                products
            });
        } catch (error) {
            console.error('Error retrieving search products:', error);
            res.status(500).json({ message: 'Error retrieving products' });
        }
    }

    // Add cart
    async addToCart(req, res) {
        try {
            const { userId, productId, quantity } = req.body;
            if (!userId || !productId) {
                return res.status(400).json({ message: 'User ID and Product ID are required' });
            }
            const validQuantity = quantity && quantity > 0 ? quantity : 1;
            const product = await ProductRepo.oneProduct(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            let cart = await ProductRepo.findCartByuserId(userId);
            if (cart) {
                const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
                if (productIndex > -1) {
                    cart.products[productIndex].quantity += validQuantity;
                } else {
                    cart.products.push({ productId, quantity: validQuantity });
                }
            } else {
                const products = [{ productId, quantity: validQuantity }];
                cart = await ProductRepo.createCart(userId, products);
            }
            await ProductRepo.updateCart(cart);
            res.status(200).json({ message: 'Cart item added successfully', cart });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }

    // Show all carts
    async getCart(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            let cart = await ProductRepo.findCartandPopulate(userId);
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            cart.products = cart.products.filter(product => product.productId !== null);
            if (cart.products.length === 0) {
                return res.status(404).json({ message: 'Cart is empty or contains only deleted products' });
            }
            const cartWithTotalValue = {
                userId: cart.userId,
                products: cart.products.map(product => {
                    const totalPrice = product.quantity * product.productId.price;
                    return {
                        productId: product.productId._id,
                        title: product.productId.title,
                        price: product.productId.price,
                        image: product.productId.image,
                        description: product.productId.description,
                        category: product.productId.category,
                        quantity: product.quantity,
                        totalPrice: totalPrice,
                    };
                }),
            };
            res.status(200).json({
                message: 'Cart retrieved successfully',
                cart: cartWithTotalValue,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }


    // Decrease cart item
    async lessCart(req, res) {  
        try {
            const { userId, productId, quantity } = req.body;
            if (!userId || !productId || quantity === undefined) {
                return res.status(400).json({ message: 'User ID, Product ID, and quantity are required' });
            }
            const product = await ProductRepo.oneProduct(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            let cart = await ProductRepo.findCartByuserId(userId);
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found for this user' });
            }
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }
            cart.products[productIndex].quantity -= quantity || 1;
            if (cart.products[productIndex].quantity <= 0) {
                cart.products.splice(productIndex, 1);
            }
            await ProductRepo.updateCart(cart);
            const populatedCart = await ProductRepo.findCartandPopulate(userId);
            let totalCartPrice = 0;
            populatedCart.products.forEach(item => {
                totalCartPrice += item.quantity * item.productId.price;
            });
            res.status(200).json({
                message: 'Cart item removed or updated',
                cart: populatedCart,
                totalCartPrice,
            });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }


}

module.exports = new productApiController();
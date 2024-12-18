const ProductRepo = require('../repository/productrepo')
const path = require('path');
const fs = require('fs');

class productAdminController {

    // Add product form
    async addProduct(req, res) {
        res.render('product/addproduct', { user: req.user })
    }

    // Add data in product 
    async addproductPost(req, res) {
        try {
            const { title, category, price, description } = req.body;
            if (!title || !category || !price || !description || !req.file) {
                req.flash('err', 'All fields are required')
                return res.redirect(generateUrl('addproduct'));
            }
            const productData = {
                title: title.trim(),
                category: category.trim(),
                price: price.trim(),
                description: description.trim(),
                image: req.file.path
            };
            await ProductRepo.createProduct(productData);
            req.flash('sucess', 'Product added sucessfully')
            return res.redirect(generateUrl('productlist'));
        } catch (error) {
            console.error('Error saving blog:', error);
            req.flash('err', 'Error posting blog')
            return res.redirect(generateUrl('addproduct'));
        }
    }

    // Get product list 
    async showproduct(req, res) {
        try {
            const products = await ProductRepo.allProducts();
            res.render('product/productlist', { products, user: req.user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error retrieving products" });
        }
    }

    // Handle Toggle Active Product
    async toggleProductActive(req, res) {
        try {
            const productId = req.params.id;
            const product = await ProductRepo.oneProduct(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            product.active = !product.active;
            await product.save();
            req.flash('sucess', "Active status change sucessfully")
            res.redirect(generateUrl('productlist'));
        } catch (error) {
            console.error(error);
            req.flash('err', "This blog is not active for user")
            res.status(500).json({ message: "Error updating blog status" });
        }
    }

    // Single product 
    async singleproduct(req, res) {
        const id = req.params.id;
        try {
            const product = await ProductRepo.oneProduct(id);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.render('product/editproduct', { product, user: req.user });
        } catch (error) {
            console.error('Error fetching product:', error);
            return res.status(500).send('Error fetching product');
        }
    }

    // Handle PUT or PATCH for update blog
    async updateproduct(req, res) { 
        const id = req.params.id;
        // Deleting image from uploads folder start
        if (req.file) {
            const product = await ProductRepo.oneProduct(id); // Find product by id
            const imagePath = path.resolve(__dirname, '../../../../', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file:', err);
                    } else {
                        console.log('Image file deleted successfully:', product.image);
                    }
                });
            } else {
                console.log('File does not exist:', imagePath);
            }
        }
        // Deleting image from uploads folder end
        try {
            const { title, category, price, description } = req.body;
            if (!title || !category || !price || !description) {
                req.flash('err', 'All fields are required')
                return res.redirect(generateUrl('editproduct', { id }));
            }
            const existingProduct = await ProductRepo.oneProduct(id)
            if (!existingProduct) {
                return res.status(404).send('Blog not found.');
            }
            const productData = {
                title: title.trim(),
                category: category.trim(),
                price: price.trim(),
                description: description.trim(),
                image: req.file ? req.file.path : existingProduct.image,
            };
            // Update the blog
            await ProductRepo.updateproduct(id, productData); 
            console.log(`Blog with ID ${id} updated`);
            req.flash('sucess', 'Product updated successfully');
            return res.redirect(generateUrl('productlist'));
        } catch (error) {
            console.error('Error updating product:', error);
            return res.status(500).send('Error updating product');
        }
    }

     // Handle DELETE for delete product
     async deleteproduct(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        const product = await ProductRepo.oneProduct(id)
        const imagePath = path.resolve(__dirname, '../../../../', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Image file deleted successfully:', product.image);
                }
            });
        } else {
            console.log('File does not exist:', imagePath);
        }
        // Deleting image from uploads folder end
        try {
            await ProductRepo.deleteproduct(id)
            req.flash('sucess', "Product deleted sucessfully")
            return res.redirect(generateUrl('productlist')); // Redirect product after deleting data
        } catch (error) {
            console.error('Error deleting product:', error);
            return res.status(500).send('Error deleting product');
        }
    }
}

module.exports = new productAdminController();
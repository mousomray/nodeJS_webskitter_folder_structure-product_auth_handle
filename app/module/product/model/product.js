const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: "Title is required",
        minlength: [3, 'Title must be at least 3 characters']
    },
    category: {
        type: String,
        required: "Category is required",
        enum: ['fashion', 'electronic', 'jewellery'],
        minlength: [3, 'Category must be at least 3 characters long']
    }, 
    price: {
        type: Number,
        required: "Price is Required"
    },
    image: {
        type: String,
        required: "Enter image it is Required"
    },
    description: {
        type: String,
        required: "Description is required",
        minlength: [10, 'Description must be at least 10 characters']
    },
    active: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
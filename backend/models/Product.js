const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter a product name"],
		unique: true
	},
	description: {
		type: String,
		required: [true, "Please enter a ingredients"]
	},
	price: {
		type: Number,
		required: [true, "Please enter a price"]
	},
	category: {
		type: String,
		required: [true, "Please enter a category"]
	},
	imagePath: {
		type: String, // Path to the image in the disk
		required: [true, "Please upload an image"] // image must exist
	}
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;

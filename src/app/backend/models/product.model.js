const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, 'enter username'],
	},
    profilepicture: {
        type: String,
        required: false
    }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
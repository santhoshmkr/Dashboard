const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    trim: true, // Trim whitespace from the category name
  },
  category_image:{
    type:String
  },
  category_Description:{
    type:String
  }
});

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
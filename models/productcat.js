const mongoose = require('mongoose');

const ProductcatSchema = new mongoose.Schema({
   // _id: false,
    id: { type: Number, unique: true, },
    name: { type: String },
    slug: { type: String },
    parent: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    description:{ type: String , default: ""},
    display:{ type: String , default: "default"},
    image:{ type: String , default: null},
    menu_order:{ type: Number, default: 0 }
},{ collection: 'product_categories' });


module.exports = mongoose.models.Product_Categories || mongoose.model("Product_Categories", ProductcatSchema);

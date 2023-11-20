const mongoose = require('mongoose');

const ProductTermsSchema = new mongoose.Schema({
   // _id: false,
    id: { type: Number, unique: true, },
    attr_id: { type: Number },
    name: { type: String },
    slug: { type: String },
    menu_order: { type: Number, default: 0 },
    count:{ type: Number , default: 0}, 
},{ collection: 'product_attribute_terms' });


module.exports = mongoose.models.Product_Terms || mongoose.model("Product_Terms", ProductTermsSchema);

const mongoose = require('mongoose');

const ProductattrSchema = new mongoose.Schema({
   // _id: false,
    id: { type: Number, unique: true, },
    name: { type: String },
    slug: { type: String },
    type: { type: String, default: "select" },
    order_by: { type: String, default: "menu_order" },
    has_archives:{ type: Boolean , default: false}, 
},{ collection: 'product_attributes' });


module.exports = mongoose.models.Product_Attributes || mongoose.model("Product_Attributes", ProductattrSchema);

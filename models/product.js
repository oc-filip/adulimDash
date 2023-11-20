import { Schema, models, model } from 'mongoose';

const ProductSchema = new Schema({
    //_id: false,
    id: { type: Number, unique: true, },
    name: { type: String },
    type: { type: String },
    status: { type: String },
    sku: { type: String },
    regular_price: { type: String },
    price_html: { type: String },
    stock_status: { type: String },
    images: {  
        type: Array,
        src: { 
            type: String ,default: null
        },
    },
    
});


export default models.Product || model("Product", ProductSchema);

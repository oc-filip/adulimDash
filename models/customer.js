const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    //_id: false,
    id: { type: Number , unique: true },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    username: { type: String },
    password: { type: String },
    role: { type: String, default: "customer" },
    avatar_url: { type: String },
    date_created: { type: String },
    date_created_gmt: { type: String },
    date_modified: { type: String },
    date_modified_gmt: { type: String },
    billing: {
        first_name: { type: String },
        last_name: { type: String },
        company: { type: String , default: ""},
        address_1: { type: String },
        address_2: { type: String },
        city: { type: String },
        state: { type: String , default: ""},
        country: { type: String , default: "IL"},
        postcode: { type: String },
        email: { type: String },
        phone: { type: String },
    },
    shipping: {
        first_name: { type: String },
        last_name: { type: String },
        company: { type: String , default: ""},
        address_1: { type: String },
        address_2: { type: String },
        city: { type: String },
        state: { type: String , default: ""},
        country: { type: String , default: "IL"},
        postcode: { type: String },
    },
    
},{ collection: 'customers' });



module.exports = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

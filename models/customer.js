const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    //_id: false,
    customer_id: { type: Number , unique: true },
    first_name: { type: String },
    last_name: { type: String },
    city: { type: String },
    
    street: { type: String },
    email: { type: String },
    phone: { type: String },
    phone2: { type: String },
    balance: { type: Number },
    
},{ collection: 'Customers' ,strict: false});



module.exports = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

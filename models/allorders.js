const mongoose = require('mongoose');

const AllOrdersSchema = new mongoose.Schema({
    document_number: { type: Number , unique: true },
},{ collection: 'AllOrders' ,strict: false});



module.exports = mongoose.models.AllOrders || mongoose.model("AllOrders", AllOrdersSchema);

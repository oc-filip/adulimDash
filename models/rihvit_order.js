const mongoose = require('mongoose');

const RihvitOrderSchema = new mongoose.Schema({
    document_number: { type: Number, unique: true, },
    document_type: { type: Number },
    document_type_name:  { type: String },
    customer_id: { type: Number },
    customer_name: { type: String },
    document_date:  { type: String },
    document_time:  { type: String },
    amount: { type: Number },
    amount_exempt: { type: Number },
    agent_id: { type: Number },
    is_cancelled: { type: Boolean}, 
    is_accounting: { type: Boolean}, 
    //total_vat: { type: Decimal128 },
    sort_code: { type: Number },
    phone: { type: String },
    reference: { type: String },
    project_id: { type: Number },
    order:  { type: String },

},{ collection: 'AllOrders' });


module.exports = mongoose.models.Rihvit_Order || mongoose.model("Rihvit_Order", RihvitOrderSchema);

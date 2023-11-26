const mongoose = require('mongoose');

const OrdersGroupedSchema = new mongoose.Schema({
    UserID: { type: Number , unique: true },
    AverageFrequency:{ type: Number },
    NumOfOrders:{ type: Number },
    LastOrder:{ type: Object },
    Last5amounts:{ type: Array },
    pipedrive_id:{ type: Number },
    reccuring:{ type: String },
    Last5Avg:{ type: Number },
    LastOrderDate:{ type: Date },
    NextOrderDate:{ type: Date },
    CallToUser:{ type: Boolean },
    Lastamount:{ type: Number },
    NumAmounts:{ type: Number },
},{ collection: 'OrdersGrouped' ,strict: false});



module.exports = mongoose.models.OrdersGrouped || mongoose.model("OrdersGrouped", OrdersGroupedSchema);

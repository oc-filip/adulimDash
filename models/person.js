const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    id: { type: Number , unique: true },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: Array },
    name: { type: String },
    phone: { type: Array }
    
},{ collection: 'new_persons' });



module.exports = mongoose.models.Person || mongoose.model("Person", PersonSchema);

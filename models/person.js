const mongoose = require('mongoose');


const PersonSchema = new mongoose.Schema({
    id: { type: Number , unique: true },
},{ collection: 'new_persons' ,strict: false});



module.exports = mongoose.models.Person || mongoose.model("Person", PersonSchema);

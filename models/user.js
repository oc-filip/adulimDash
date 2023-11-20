const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    //_id: false,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    
},{ collection: 'users' });


module.exports = mongoose.models.User || mongoose.model("User", UserSchema);

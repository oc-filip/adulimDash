const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    id: { type: Number },
    first_name: { type: String  },
    last_name: { type: String  },
    b38f26908a473cb2993a861d9590b687a9a0ca15: { type: Number  },

},{ collection: 'Persons' ,strict: false});



module.exports = mongoose.models.Person || mongoose.model("Person", PersonSchema);

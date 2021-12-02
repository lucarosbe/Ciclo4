const mongoose = require('mongoose');
const citasSchema = new mongoose.Schema({
    especialidad:{
        type: String
    },
    nombre:{
        type: String
    },
    fecha:{
        type: Date
    },
    hora:{
        type: String
    }
});
module.exports = mongoose.model('Citas', citasSchema)
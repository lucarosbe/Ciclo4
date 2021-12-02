const mongose = require('mongoose');
const usuariosSchema = new mongose.Schema({
    nombre:{
        type: String
    },
    telefono:{
        type: String
    },
    correo:{
        type: String
    },
    contrasenia:{
        type: String
    }
})
module.exports = mongose.model('Usuarios', usuariosSchema)
const express = require('express');
const app = express();
const citas = require('./routers/citas');
const usuarios = require('./routers/usuarios');
const validacionUser = require('./routers/validacionUsuarios');
//Middlewares -> ayudan a que el cliente y el server se entiendan con JSON Objct.
app.use(express.json()); // -> interpretar el body en JSON Objct.
app.use(express.urlencoded({extended:true})) // > interpreta lo que viene en la URL como JSON Objct.
//-> middleware CORS
const cors = require('cors');
app.use(cors());
//Conexion con mongoDB
//Importar modulos Mongoose
const mongose = require('mongoose');
//Conectar con DB
mongose.connect('mongodb://127.0.0.1:27017/db2')
    .then(() => console.log("Conexion exitosa con DB de mongo !...."))
    .catch(err => console.log("Fallo la conexion...", err))
//Rutas de acceso a server
app.use('/api/citas', citas);
app.use('/api/usuarios', usuarios)
app.use('/api/validacion', validacionUser)

//Listener de nuestro server
const puerto = 3000;
app.listen(puerto, () => {
    console.log(`Server desde EXPRESS escuchando por puerto ${puerto} .....`)
})

const express = require('express');
const ruta = express();
const Usuarios = require('../models/usuarios_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Middlewares -> ayudan a que el cliente y el server se entiendan con JSON Objct.
ruta.use(express.json()); // -> interpretar el body en JSON Objct.
ruta.use(express.urlencoded({extended:true})) // > interpreta lo que viene en la URL como JSON Objct.

//Validacion TOKEN
let verificacionToken = (req, res, next) => {
    let token = req.get('validacion');
    jwt.verify(token, 'contrasenia', (err, decoded) => {
        if(err){
            return res.json({
                err: err
            })
        }
        req.usuario = decoded.usuario
        next()
    })
}

ruta.get('/', verificacionToken, (req, res) => {
    let leerUsers = leerUsuarios()

    leerUsers
        .then(data => {
            res.json({
                data: data
            })
        }).catch(err => {
            res.json({
                error: err
            })
        })
})

//GET
async function leerUsuarios(){
    let leerUser = Usuarios.find()
    return await leerUser
}

//POST
ruta.post('/', (req, res) => {
    let body = req.body

    //Validacion del correo electronico
    Usuarios.findOne({correo: body.correo}, (err, user) => {
        if(err){
            return res.json({
                msj: "Paso algo y todo fallo !"
            })
        }
        if(user){
            return res.json({
                msj: "Usuario ya se encuentra registrado !"
            })
        }
        if(!user){
            let nuevoUsuario = ingresarUsuario(body)
            nuevoUsuario
                .then(user => {
                    res.json({
                        dato: user
                    })
                })
                .catch(err => {
                    res.json({
                        error: err
                    })
                })
        }
    })
})
//funcion POST
async function ingresarUsuario(body){
 let usuarioNuevo = new Usuarios({
    nombre: body.nombre,    
    telefono: body. telefono,
    correo: body.correo,
    contrasenia: bcrypt.hashSync(body.contrasenia, 10)
 })
 return await usuarioNuevo.save();
}

//Exportamos Router
module.exports = ruta;
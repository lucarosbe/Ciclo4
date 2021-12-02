const express = require('express');
const ruta = express();
const Usuario = require('../models/usuarios_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

ruta.post('/', (req, res) => {
    let body = req.body;
    //console.log(body)
    Usuario.findOne({correo: body.correo})
        .then(datos => {
            if(datos){
                const validacionContrasenia = bcrypt.compareSync(body.contrasenia, datos.contrasenia)
                if(!validacionContrasenia){
                 res.json({
                    msj: "Usuario y/o contrasenia mal ingresados !"
                 })
                }else{
                    //Asignar el token al usuario
                    const token = jwt.sign({ _id: datos._id, nombre: datos.nombre, correo: datos.correo}, 'contrasenia', { expiresIn: '1h' });
                    res.json({
                        usuario: {
                            _id: datos._id,
                            nombre: datos.nombre,
                            correo: datos.correo
                        },token
                    })
                }
            }else{
                res.json({
                    msj: "Usuario y/o contrasenia mal ingresados !"
                })
            }
        }).catch(err => {
            res.json({
                msj: "error en el server"
            })
        })
})
module.exports = ruta;
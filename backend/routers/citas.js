const express = require('express');
const Citas = require('../models/citas_model');
const ruta = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
//Middlewares -> ayudan a que el cliente y el server se entiendan con JSON Objct.
ruta.use(express.json()); // -> interpretar el body en JSON Objct.
ruta.use(express.urlencoded({extended:true})) // > interpreta lo que viene en la URL como JSON Objct.

//Validacion TOKEN
let verificacionToken = (req, res, next) => {
    let token = req.get('Authorization');
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

//Get----> Hacer una consulta al server. para pedir una base de datios.
ruta.get('/', verificacionToken, (req, res) => {
    let resultadoCitas = leerCtias();
    resultadoCitas
        .then(cti => {
            res.json({
                valor : cti
            })
        })
        .catch(err => {
            res.json({
                error: err
            })
        })
})
//GET ---> 
async function leerCtias(){
    let citas = Citas.find();
    return await citas;
}
//POST -> envio de datos a nuestro modelo -> citas_modelo --
ruta.post('/', verificacionToken, (req, res) => {
    let body = req.body;
    //Validacion:
    let validacionDb = validacionDatos(body.especialidad, body.nombre, body.fecha, body.hora);

    if(!validacionDb){
        let resultado = crearCita(body);
        resultado.then( cti => {
            res.json({
                valor: cti
            })
        }).catch( err => {
            res.json({
                error: err
            })
        })
    }else{
        res.json({
            error: validacionDb.details[0].message
        })
    }
})
//POST -> handling con un async await -> crar una funcion de POST.
async function crearCita(body){    
    let cita = new Citas({
        especialidad: body.especialidad,
        nombre: body.nombre,
        fecha: body.fecha,
        hora: body.hora
    });
    return await cita.save()
}
//PUT -> Actualizar un campo !!
ruta.put('/:nombre', verificacionToken, (req, res) => {
    let body = req.body;
    let nombre = req.params.nombre;
    //Validacion:
    let validacionDb = validacionDatosPut(body.especialidad, body.fecha, body.hora);

    if(!validacionDb){
        let resultadoPut = actualizarCita(req.params.nombre, body);
        resultadoPut.then( valor => {
            res.json({
                valor: valor
            })
        }).catch( err => {
            res.json({
                error: err
            })
        })
    }else{
        res.json({
            error: validacionDb.details[0].message
        })
    }
    
})
//PUT -> handling de la info.
async function actualizarCita(nombre_id, body){
    let citasActualizar = Citas.updateOne({nombre: nombre_id},{
        $set:{
            especialidad: body.especialidad,
            fecha: body.fecha,
            hora: body.hora
        }
    })
    return await citasActualizar;
}
//DELETE -> es para eliminar un dato del server -> de nuestra base de datos
ruta.delete('/:nombre', verificacionToken,  (req, res) => {
    let borrarCitaEsp = borraCita(req.params.nombre);
    borrarCitaEsp
        .then(cti => {
            res.json({
                valor: cti
            })
        })
        .catch(err => {
            res.json({
                error: err
            })
        })
})
//DELETE -> handling de la info
async function borraCita(nombre_id){
    let borrarCita = Citas.deleteOne({nombre: nombre_id})
    return await borrarCita;
}
//Validcion de datos.
function validacionDatos(esp, nom, fech, hora){
    const shema = Joi.object({
        esp: Joi.string()
        .alphanum()
        .min(4)
        .max(20)
        .required(),
        nom: Joi.string()
        .min(4)
        .max(20)
        .required(),
        fech: Joi.date().iso()
        .required(),
        hora: Joi.string()
        .min(4)
        .max(20)
        .required()
    }).and('esp', 'nom', 'fech', 'hora');
    const {error, value} = shema.validate({esp: esp, nom: nom, fech: fech, hora: hora});
    return error;
}
//Validcion de datosPUT
function validacionDatosPut(esp, fech, hora){
    const shema = Joi.object({
        esp: Joi.string()
        .alphanum()
        .min(4)
        .max(20)
        .required(),
        fech: Joi.date().iso()
        .required(),
        hora: Joi.string()
        .min(4)
        .max(20)
        .required()
    }).and('esp', 'fech', 'hora');
    const {error, value} = shema.validate({esp: esp, fech: fech, hora: hora});
    return error;
}
//Exportamos Router
module.exports = ruta;
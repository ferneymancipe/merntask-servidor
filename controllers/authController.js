const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //Revisa si hay errores en el request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    const {email, password} = req.body;

    try {
        //Revisar que el usuario existe
        let usuario = await Usuario.findOne({email});
        if (!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        //Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({msg: 'Password incorrecto'});
        }

        //Si la autenticación es correcta, crear y firmar el JWT (Json Web Token)
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;
            res.json({token});
        })
        
        //Mensaje de respuesta
        // res.json({msg:'Usuario Creado correctamente'});
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error'});
    }
}

//Obtiene que un usuairo está autenticado
exports.usuarioAutenticado = async (req, res)  => {

    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error'});
    }
}
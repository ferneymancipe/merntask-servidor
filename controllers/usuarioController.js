const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisa si hay errores en el request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    const {email, password} = req.body;

    try {
        //Revisar que el usuario sea único
        let usuario = await Usuario.findOne({email});
        if (usuario) {
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        //Crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //Guardar usuario
        await usuario.save();

        //Crear y firmar el JWT (Json Web Token)
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
        return res.status(400).json({msg: 'Hubo un error'});
    }
}
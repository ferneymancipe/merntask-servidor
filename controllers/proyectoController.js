const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearProyecto = async (req, res) => {
    
    //Revisa si hay errores en el request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    try {
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        //Guardamos el proyecto
        await proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error'});
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id});
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error'});
    }
}

//Actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {
    
    //Revisa si hay errores en el request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    //Extraer la información del proyecto
    const {nombre} = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {

        //Revisar el ID del proyecto
        let proyecto = await Proyecto.findById(req.params.id);

        //Valida si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }
        
        //Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});
        res.json({proyecto});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Elimina un proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
    try {
        //Revisar el ID del proyecto
        let proyecto = await Proyecto.findById(req.params.id);

        //Valida si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }
        
        //Elimina el proyecto
        await Proyecto.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Proyecto Eliminado'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}
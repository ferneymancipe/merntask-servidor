const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearTarea = async (req, res) => { 
    //Revisa si hay errores en el request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }
    
    try {
        //Extraer el proyecto y comprobar si existe
        const {proyecto} = req.body;

        const proyectoExiste = await Proyecto.findById(proyecto);
        if (!proyectoExiste) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Verificar el creador del proyecto
        if (proyectoExiste.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error'});
    }
}

exports.obtenerTareas = async (req, res) => {
    try {
        const proyecto = req.params.id;
        //Extraer el proyecto y comprobar si existe
        const proyectoExiste = await Proyecto.findById(proyecto);
        if (!proyectoExiste) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Verificar el creador del proyecto
        if (proyectoExiste.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }

        //Obtiene las tareas por proyecto
        const tareas = await Tarea.find({proyecto});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error'});
    }
}
exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el proyecto, nombre tarea y su estado
        const {proyecto, nombre, estado} = req.body;

        //Si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({msg: 'Tarea no existe'});
        }

        const proyectoExiste = await Proyecto.findById(proyecto);

        //Verificar el creador del proyecto
        if (proyectoExiste.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }

        if (tarea.proyecto.toString() !== proyecto) {
            return res.status(401).json({msg: 'Tarea no pertenece a este proyecto'});
        }

        //Crear objeto con la nueva información
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        //Si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({msg: 'Tarea no existe'});
        }

        const proyectoExiste = await Proyecto.findById(tarea.proyecto.toString());

        //Verificar el creador del proyecto
        if (proyectoExiste.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }

        //Elimina la tarea
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}
//Rutas para creacion de tareas
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//Crea tarea (/api/tareas)
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

//Consulta las tareas por proyecto
router.get('/:id',
    auth,
    tareaController.obtenerTareas
);

//Actualiza tarea
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.actualizarTarea
);

//Eliminar una tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;
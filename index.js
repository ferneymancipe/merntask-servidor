const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar a la DB
conectarDB();

//Habilitar cors
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());

//Habilitar express.json
app.use(express.json({extended: true}));

//Puerto de la app
const port = process.env.PORT || 4000;

//Importar Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//Definir página principal
app.get('/', (req, res) => {
    res.send('Hola Mundo')
});

//Iniciar la app
app.listen(port, () => {
    console.log(`Servidor iniciado en puerto ${port}`);
});
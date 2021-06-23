const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('DB Conectada');
    } catch (error) {
        console.log(error);
        //Detener la app
        process.exit(1);
    }
}

module.exports = conectarDB;
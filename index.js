
const express = require('express');
const { dbConnection } = require('./database/db_config');
require('dotenv').config();
const cors = require('cors');

const app = express();

// CORS
app.use(cors());

// ubicación de la carpeta public
app.use( express.static('public') );

// Conectar a mongoDB
dbConnection();

// Lectura del body
app.use( express.json() );

// Rutas
app.use( '/api/auth', require('./routes/auth'));
app.use( '/api/events', require('./routes/events'));


app.listen( process.env.PORT, () => {
    console.log(`Servidor montado y ejecutandose en el puerto ${process.env.PORT}`);
});
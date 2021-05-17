const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection }  = require('./database/config'); 

// console.log(process.env.PORT);

// crear el servidor de express
const app = express();

// Base de datos
dbConnection(); 

// Cors
app.use(cors());

// directorio publico, use es un middleware
app.use( express.static('public'));

// lectura y parseo del body
app.use( express.json());

// rutas
// TODO: auth -> crear, login, refreshToken
app.use('/api/auth', require('./routes/auth'));
// TODO: CRUD -> Eventos
app.use('/api/events', require('./routes/events'));


// escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }...`);
});

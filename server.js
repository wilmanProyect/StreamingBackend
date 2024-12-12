const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

const url_db = process.env.URL_DB;
const port = process.env.PORT_LOCAL;
// Conexion a MongoDB
mongoose.connect(url_db)
    .then(()=>console.log('Conectado a MongoDB'))
    .catch((error)=> console.log('Error al conectarse a MongoDB',error));

                    // Rutas
//Usuario
app.use('/users', userRoutes);

app.listen(port, () => 
    console.log(`Servidor corriendo en el puerto http://localhost:${port}`)
);

//Archivos 
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/uploads', uploadRoutes);

const seriesRoutes = require('./routes/seriesRoutes');
app.use('/content',seriesRoutes);
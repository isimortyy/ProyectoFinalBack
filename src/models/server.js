import express from 'express';
import http from 'http';
import cors from 'cors';
import { dbconnect } from "../../databases/config.js"

import apprenticeR from '../routes/apprentice.js'
// import assignamentR from '../routes/assignment.js'
import binnaclesR from '../routes/binnacles.js'
import followupR from '../routes/followup.js'
import logsR from '../routes/log.js'
import modalityR from '../routes/modality.js'
import register from '../routes/register.js';
import repfora from '../routes/repfora.js';
import path from 'path';  // Necesitamos esta importación para resolver rutas de archivos estáticos

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Conexión a la base de datos
        this.conectarbd();
    }

    async conectarbd() {
        await dbconnect();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());

        // Servir archivos estáticos desde la carpeta 'public'
        this.app.use(express.static(path.join(__dirname, 'public'))); // Sirve la carpeta 'public'
    }

    routes() {
        this.app.use('/api/apprentice', apprenticeR);
        // this.app.use('/api/assignment', assignamentR);
        this.app.use('/api/binnacles', binnaclesR);
        this.app.use('/api/followup', followupR);
        this.app.use('/api/log', logsR);
        this.app.use('/api/modality', modalityR);
        this.app.use('/api/register', register);
        this.app.use('/api/repfora', repfora);

        // Redirigir todas las rutas no encontradas al 'index.html' de Vue
        this.app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'public', 'index.html')); // Redirige a index.html
        });
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}

export { Server };

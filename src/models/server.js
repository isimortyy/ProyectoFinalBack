import express from 'express';
import http from 'http';
import cors from 'cors';
import { dbconnect } from "../../databases/config.js"

import  apprenticeR   from '../routes/apprentice.js'
/* import  assignamentR  from '../routes/assignment.js' */
import  binnaclesR  from '../routes/binnacles.js'
import  followupR  from '../routes/followup.js'
import  logsR  from '../routes/log.js'
import  modalityR  from '../routes/modality.js'
import register from '../routes/register.js';
import  repfora from '../routes/repfora.js'


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT 
        this.server = http.createServer(this.app);
    
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        this.conectarbd()
    }

    async conectarbd(){
        await dbconnect();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use('/api/apprentice', apprenticeR);
       /*  this.app.use('/api/assignment', assignamentR); */
        this.app.use('/api/binnacles', binnaclesR);
        this.app.use('/api/followup', followupR);
        this.app.use('/api/log', logsR);
        this.app.use('/api/modality', modalityR);
        this.app.use('/api/register',register)
        this.app.use('/api/repfora',repfora)
        
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`);
        });
    }
}
export { Server };
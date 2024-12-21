// libreria para variables de entorno
import dotenv from 'dotenv';
// libreria de express
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import smartMoneyRouter from './routes/smart_money.js';

dotenv.config();

const PORT = process.env.PORT;
const expressApp = express();

// Obtén __dirname usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware para servir archivos estáticos
expressApp.use(express.static(path.join(__dirname, 'public')));

expressApp.use(express.json());
expressApp.use(express.text());

expressApp.use(process.env.PATH_P, smartMoneyRouter)

expressApp.listen(PORT, 
    () => console.log(`Servidor levantado en el puerto: ${PORT}`))
;
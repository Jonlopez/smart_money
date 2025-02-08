// libreria para variables de entorno
import dotenv from 'dotenv';
// libreria de express
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import smartMoneyRouter from './routes/smart_money.js';
import appRouter from './routes/app.js';
import Constantes from './utils/constantes.js';

dotenv.config();

// Verificación de variables de entorno
console.log('Variables de entorno cargadas:', {
    PORT: process.env.PORT,
    PATH_P: process.env.PATH_P,
    PATH_APP: process.env.PATH_APP,
    MODO_DEMO: process.env.MODO_DEMO,
    ENTORNO: process.env.ENTORNO,
});

const PORT = process.env.PORT;
const expressApp = express();

// Obtén __dirname usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Primero las configuraciones básicas de express
expressApp.use(express.json());
expressApp.use(express.text());
expressApp.use(express.static(path.join(__dirname, 'public')));

// 2. Configuración de vistas
expressApp.set('view engine', 'ejs');
expressApp.set('views', './views');

// 3. Middleware para Constantes (ANTES de las rutas)
expressApp.use((req, res, next) => {
    res.locals.Constantes = Constantes;
    next();
});

// 4. Rutas (DESPUÉS del middleware)
expressApp.use(process.env.PATH_P, smartMoneyRouter);
expressApp.use(process.env.PATH_APP, appRouter);

expressApp.listen(PORT, 
    () => console.log(`Servidor levantado en el puerto: ${PORT}`))
;
// libreria para variables de entorno
import dotenv from 'dotenv';
// libreria de express
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import demoRouter from './routes/demo/demo.js';
import appDemoRouter from './routes/demo/app_demo.js';
import smartMoneyRouter from './routes/smart_money.js';
import appRouter from './routes/app.js';
import Constantes from './utils/constantes.js';
import i18n from './utils/i18n.js';
import languageRouter from './routes/language.js';
import cookieParser from 'cookie-parser';

dotenv.config();

// Verificación de variables de entorno
console.log('Variables de entorno cargadas:', {
    PORT: process.env.PORT,
    PATH_DEMO: process.env.PATH_DEMO,
    PATH_DEMO_APP: process.env.PATH_DEMO_APP,
    PATH_P: process.env.PATH_P,
    PATH_APP: process.env.PATH_APP,
    ENTORNO: process.env.ENTORNO,
});

const PORT = process.env.PORT;
const expressApp = express();

// Obtén __dirname usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Primero las configuraciones básicas de express
expressApp.use(cookieParser());
expressApp.use(express.json());
expressApp.use(express.text());
expressApp.use(express.static(path.join(__dirname, 'public')));

// 2. Configuración de vistas
expressApp.set('view engine', 'ejs');
expressApp.set('views', './views');

// 3. Middleware para Constantes (ANTES de las rutas)
expressApp.use((req, res, next) => {
    res.locals.Constantes = Constantes;
    const userLocale = req.cookies.locale || req.acceptsLanguages(['es', 'en', 'ca']) || 'es';
    res.locals.i18n = i18n;
    res.locals.currentLocale = userLocale;
    next();
});

// 4. Rutas (DESPUÉS del middleware)
expressApp.use(process.env.PATH_DEMO, demoRouter);
expressApp.use(process.env.PATH_DEMO_APP, appDemoRouter);
expressApp.use(process.env.PATH_P, smartMoneyRouter);
expressApp.use(process.env.PATH_APP, appRouter);
expressApp.use('/', languageRouter);

expressApp.listen(PORT, 
    () => console.log(`Servidor levantado en el puerto: ${PORT}`))
;
// libreria para variables de entorno
import dotenv from 'dotenv';
// libreria de express
import express from 'express';

import smartMoneyRouter from './routes/smart_money.js';

dotenv.config();

const PORT = process.env.PORT;
const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.text());

expressApp.use(process.env.PATH_P, smartMoneyRouter)

expressApp.listen(PORT, 
    () => console.log(`Servidor levantado en el puerto: ${PORT}`));
// libreria de express
import express from 'express';
import { Router } from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const expressApp = express();
const smartMoneyRouter = Router();

// Obtén __dirname usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDir = path.join(__dirname, '..');

smartMoneyRouter.use((req, res, next) => {
    console.log(req.ip);
    next();
});

smartMoneyRouter.get('', (req, res) => {
    console.log(path.join(__dirname, 'public'));
    console.log(parentDir);
    return res.sendFile(path.join(parentDir, 'views', 'index.html'));
});

smartMoneyRouter.get('/buttons', (req, res) => {
    console.log(path.join(__dirname, 'public'));
    console.log(parentDir);
    return res.sendFile(path.join(parentDir, 'views', 'buttons.html'));
});

smartMoneyRouter.get('/cards', (req, res) => {
    console.log(path.join(__dirname, 'public'));
    console.log(parentDir);
    return res.sendFile(path.join(parentDir, 'views', 'cards.html'));
});


/*import fs from 'fs';

const cssPath = path.join(parentDir, 'public', 'css', 'styles.css');

fs.access(cssPath, fs.constants.R_OK, (err) => {
    if (err) {
        console.error('No se puede acceder al archivo:', err.message);
    } else {
        console.log('El archivo es accesible.');
    }
});*/

export default smartMoneyRouter;
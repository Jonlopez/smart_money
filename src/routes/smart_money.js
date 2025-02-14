// libreria de express
import express from 'express';
import { Router } from "express";

const expressApp = express();
const smartMoneyRouter = Router();

smartMoneyRouter.use((req, res, next) => {
    console.log(req.ip);
    next();
});

// Agregar configuración de EJS
expressApp.set('view engine', 'ejs');

const datos = {
    titulo: "Smart Money",
    version: "1.0",
    usuario: {
        nombre: "Jon McClain",
        email: "jon.mcclain@gmail.com",
        imagen: "/img/undraw_profile.svg"
    }
};

smartMoneyRouter.get('', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Dashboard",
        contenido: "../dashboard", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/data-entry', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Data Entry",
        contenido: "../data-entry", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/tables', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Tablas",
        contenido: "../tablas", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/404', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - 404",
        contenido: "../404",     
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
}); 

export default smartMoneyRouter;
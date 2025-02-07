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
    version: "1.0"
};

smartMoneyRouter.get('', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Dashboard",
        contenido: "../dashboard2", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/buttons', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Buttons Jon",
        contenido: "../buttons", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/cards', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Cards",
        contenido: "../cards", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/utilities-animation', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Utilisties Animation",
        contenido: "../utilities-animation", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/utilities-border', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Utilisties Border",  
        contenido: "../utilities-border", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/utilities-color', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Utilisties Color",   
        contenido: "../utilities-color", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/utilities-other', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Utilisties Other",   
        contenido: "../utilities-other", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});


smartMoneyRouter.get('/charts', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Charts",
        contenido: "../charts", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/tables', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Tables",
        contenido: "../tables", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/index', vista);
});

smartMoneyRouter.get('/blank', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Blank Page",
        contenido: "../blank",     
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
// libreria de express
import express from 'express';
import { Router } from "express";

const expressApp = express();
const appRouter = Router();

appRouter.use((req, res, next) => {
    console.log(req.ip);
    next();
});

// Agregar configuración de EJS
expressApp.set('view engine', 'ejs');

const datos = {
    titulo: "SB Admin 2",
    version: "1.0"
};

appRouter.get('/forgot-password', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Forgot Password",
        contenido: "../forgot-password", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/app', vista);
});

appRouter.get('/register', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Register",
        contenido: "../register", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/app', vista);
});

appRouter.get('/login', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - Login",
        contenido: "../login", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/app', vista);
});

appRouter.get('/404', (req, res) => {
    // Ejemplo de datos que quieres pasar a la vista
    const vista = {
        global: datos,
        titulo: datos.titulo + " - 404",
        contenido: "../404", 
    };
    
    // En lugar de sendFile, usar render
    return res.render('templates/app', vista);
});

export default appRouter;
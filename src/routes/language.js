import express from 'express';
const languageRouter = express.Router();
import i18n from '../utils/i18n.js';

languageRouter.get('/change-language/:locale', (req, res) => {
    const { locale } = req.params;
    i18n.setCurrentLocale(locale);
    console.log("currentLocale", i18n.currentLocale);
    
    // Obtener la URL de referencia o usar una ruta por defecto
    const referer = req.get('Referrer') || '/';
    
    // Validar que la URL de referencia es segura (opcional pero recomendado)
    const isLocalURL = referer.startsWith('/') || referer.startsWith(req.protocol + '://' + req.get('host'));
    
    res.cookie('locale', locale, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true
    });
    
    // Redirigir a la URL validada o a la página principal
    res.redirect(isLocalURL ? referer : '/');
});

export default languageRouter;
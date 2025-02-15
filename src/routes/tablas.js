import express from 'express';
import movimientoController from '../controllers/movimientoController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('tablas');
});

router.post('/filtrar', movimientoController.filtrar);

export default router;

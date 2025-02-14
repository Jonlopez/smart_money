import express from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import path from 'path';
import Movimiento from '../models/movimiento.js';

const router = express.Router();

// Configurar multer para la subida de archivos
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.xls', '.xlsx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos Excel (.xls, .xlsx)'));
        }
    }
});

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se ha recibido ningún archivo' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const rows = XLSX.utils.sheet_to_json(worksheet, {
            header: 'A',
            range: range.s.r,
            raw: false,
            defval: ''
        });

        let insertados = 0;
        let duplicados = 0;
        let errores = 0;
        const erroresDetalle = [];
        const duplicadosDetalle = [];

        const dataRows = rows.slice(1);

        for (const [index, row] of dataRows.entries()) {
            try {
                const movimiento = {
                    fecha: formatDate(row['A']),
                    concepto: String(row['B'] || '').trim(),
                    fecha_valor: formatDate(row['C']),
                    importe: parseFloat(String(row['D'] || '0').replace(',', '.')),
                    saldo: parseFloat(String(row['E'] || '0').replace(',', '.'))
                };

                // Validar datos
                if (!movimiento.fecha || !movimiento.concepto || !movimiento.fecha_valor || 
                    isNaN(movimiento.importe) || isNaN(movimiento.saldo)) {
                    errores++;
                    erroresDetalle.push({
                        fila: index + 2, // +2 porque index empieza en 0 y saltamos la fila de headers
                        datos: row,
                        motivo: 'Datos incompletos o inválidos'
                    });
                    continue;
                }

                // Intentar insertar
                try {
                    await Movimiento.create(movimiento);
                    insertados++;
                } catch (error) {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        duplicados++;
                        duplicadosDetalle.push({
                            fila: index + 2,
                            datos: movimiento
                        });
                    } else {
                        errores++;
                        erroresDetalle.push({
                            fila: index + 2,
                            datos: row,
                            motivo: error.message
                        });
                    }
                }
            } catch (error) {
                errores++;
                erroresDetalle.push({
                    fila: index + 2,
                    datos: row,
                    motivo: error.message
                });
            }
        }

        res.json({
            success: true,
            message: 'Archivo procesado',
            resultados: {
                total: dataRows.length,
                insertados,
                duplicados,
                errores,
                erroresDetalle,
                duplicadosDetalle
            }
        });

    } catch (error) {
        console.error('Error procesando archivo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar el archivo',
            error: error.message
        });
    }
});

// Función para formatear fechas de DD/MM/YYYY a YYYY-MM-DD
function formatDate(dateStr) {
    if (!dateStr) return null;
    
    // Limpiar la cadena de fecha
    dateStr = String(dateStr).trim();
    
    // Si es una fecha en formato DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        // Asegurarse de que el año tiene 4 dígitos
        let year = parts[2];
        if (year.length === 2) {
            year = '20' + year;
        }
        return `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    
    return null;
}

export default router;

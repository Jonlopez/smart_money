import express from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import path from 'path';

const router = express.Router();

// Configurar multer para la subida de archivos
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/octet-stream'
        ];
        const allowedExtensions = ['.xls', '.xlsx'];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no válido. Solo se permiten archivos Excel (.xls, .xlsx)'));
        }
    }
});

router.post('/upload', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se han recibido archivos'
            });
        }

        const processedFiles = [];

        for (const file of req.files) {
            try {
                // Leer el archivo Excel
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                
                // Procesar cada hoja del archivo
                const fileData = {
                    fileName: file.originalname,
                    sheets: []
                };

                workbook.SheetNames.forEach(sheetName => {
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { 
                        raw: false,
                        dateNF: 'yyyy-mm-dd'
                    });

                    // Extraer metadatos y datos de la hoja
                    const sheetData = {
                        name: sheetName,
                        rowCount: jsonData.length,
                        columnCount: Object.keys(jsonData[0] || {}).length,
                        headers: Object.keys(jsonData[0] || {}),
                        data: jsonData, // Ahora cada fila es un objeto clave-valor
                        keyValuePairs: [] // Nuevo array para pares clave-valor
                    };

                    // Convertir los datos a pares clave-valor
                    jsonData.forEach((row, rowIndex) => {
                        Object.entries(row).forEach(([key, value]) => {
                            sheetData.keyValuePairs.push({
                                key: `${key} (Row ${rowIndex + 1})`,
                                value: value
                            });
                        });
                    });

                    fileData.sheets.push(sheetData);
                });

                processedFiles.push(fileData);

            } catch (error) {
                console.error(`Error procesando archivo ${file.originalname}:`, error);
                processedFiles.push({
                    fileName: file.originalname,
                    error: 'Error al procesar el archivo'
                });
            }
        }

        res.json({
            success: true,
            message: 'Archivos procesados correctamente',
            description: req.body.description,
            files: processedFiles
        });

    } catch (error) {
        console.error('Error en el procesamiento de archivos:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al procesar los archivos'
        });
    }
});

export default router;

import Movimiento from '../models/movimiento.js';
import { Op } from 'sequelize';

const movimientoController = {
    // Crear nuevo movimiento
    crear: async (req, res) => {
        try {
            const nuevoMovimiento = await Movimiento.create(req.body);
            res.status(201).json({
                success: true,
                data: nuevoMovimiento,
                mensaje: 'Movimiento creado exitosamente'
            });
        } catch (error) {
            let mensaje = 'Error al crear el movimiento';
            if (error.name === 'SequelizeUniqueConstraintError') {
                mensaje = 'Este movimiento ya existe en la base de datos';
            }
            res.status(500).json({
                success: false,
                error: error.message,
                mensaje: mensaje
            });
        }
    },

    // Obtener todos los movimientos
    listar: async (req, res) => {
        try {
            const movimientos = await Movimiento.findAll({
                order: [
                    ['fecha', 'DESC'],
                    ['fecha_valor', 'DESC']
                ]
            });
            res.status(200).json({
                success: true,
                data: movimientos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                mensaje: 'Error al obtener los movimientos'
            });
        }
    },

    // Obtener un movimiento por ID
    obtenerPorId: async (req, res) => {
        try {
            const movimiento = await Movimiento.findByPk(req.params.id);
            if (!movimiento) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Movimiento no encontrado'
                });
            }
            res.status(200).json({
                success: true,
                data: movimiento
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                mensaje: 'Error al obtener el movimiento'
            });
        }
    },

    // Actualizar un movimiento
    actualizar: async (req, res) => {
        try {
            const movimiento = await Movimiento.findByPk(req.params.id);
            if (!movimiento) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Movimiento no encontrado'
                });
            }
            
            await movimiento.update(req.body);
            res.status(200).json({
                success: true,
                data: movimiento,
                mensaje: 'Movimiento actualizado exitosamente'
            });
        } catch (error) {
            let mensaje = 'Error al actualizar el movimiento';
            if (error.name === 'SequelizeUniqueConstraintError') {
                mensaje = 'Ya existe un movimiento con estos datos';
            }
            res.status(500).json({
                success: false,
                error: error.message,
                mensaje: mensaje
            });
        }
    },

    // Eliminar un movimiento
    eliminar: async (req, res) => {
        try {
            const movimiento = await Movimiento.findByPk(req.params.id);
            if (!movimiento) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Movimiento no encontrado'
                });
            }
            
            await movimiento.destroy();
            res.status(200).json({
                success: true,
                mensaje: 'Movimiento eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                mensaje: 'Error al eliminar el movimiento'
            });
        }
    },

    // Filtrar movimientos
    filtrar: async (req, res) => {
        try {
            const { fechaDesde, fechaHasta, concepto, importeDesde, importeHasta, tipo } = req.body;
            
            let whereClause = {};
            
            if (fechaDesde && fechaHasta) {
                whereClause.fecha = {
                    [Op.between]: [fechaDesde, fechaHasta]
                };
            } else if (fechaDesde) {
                whereClause.fecha = {
                    [Op.gte]: fechaDesde
                };
            } else if (fechaHasta) {
                whereClause.fecha = {
                    [Op.lte]: fechaHasta
                };
            }

            if (concepto) {
                whereClause.concepto = {
                    [Op.like]: `%${concepto}%`
                };
            }

            if (importeDesde || importeHasta) {
                whereClause.importe = {};
                if (importeDesde) {
                    whereClause.importe[Op.gte] = importeDesde;
                }
                if (importeHasta) {
                    whereClause.importe[Op.lte] = importeHasta;
                }
            }

            if (tipo) {
                whereClause.importe = tipo === 'gastos' 
                    ? { [Op.lt]: 0 }  // Si son gastos, importe menor que 0
                    : { [Op.gte]: 0 } // Si son ingresos, importe mayor o igual que 0
            }

            const movimientos = await Movimiento.findAll({
                where: whereClause,
                order: [
                    ['fecha', 'DESC'],
                    ['fecha_valor', 'DESC']
                ]
            });

            res.status(200).json({
                success: true,
                data: movimientos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                mensaje: 'Error al filtrar los movimientos'
            });
        }
    }
};

export default movimientoController;

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movimiento = sequelize.define('Movimiento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    concepto: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fecha_valor: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    importe: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    saldo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'movimientos',
    timestamps: false,
    indexes: [{
        unique: true,
        fields: ['fecha', 'concepto', 'fecha_valor', 'importe', 'saldo']
    }]
});

export default Movimiento;

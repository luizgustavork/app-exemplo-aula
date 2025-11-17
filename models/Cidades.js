import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cidades = sequelize.define('Cidades', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false
  }
}, {
  tableName: 'cidades',
  timestamps: true
});

export default Cidades;

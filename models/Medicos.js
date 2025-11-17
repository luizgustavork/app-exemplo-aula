import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Medicos = sequelize.define('Medicos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  crm: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true
  },
  especialidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Especialidades',
      key: 'id'
    }
  },
  cidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Cidades',
      key: 'id'
    }
  }
}, {
  tableName: 'medicos',
  timestamps: true
});

export default Medicos;

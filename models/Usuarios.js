import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuarios = sequelize.define('Usuarios', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  isAdmin: DataTypes.BOOLEAN,
  password: DataTypes.STRING,
  dateBirth: DataTypes.DATE
});

export default Usuarios;

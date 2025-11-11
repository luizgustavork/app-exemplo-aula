import sequelize from './config/database.js';
import Usuarios from './models/Usuarios.js';

await sequelize.sync({ force: false, alter: true });
console.log('Database synced!');
process.exit(0);
import sequelize from '../config/database.js';
import Usuarios from './Usuarios.js';
import Medicos from './Medicos.js';
import Especialidades from './Especialidades.js';
import Cidades from './Cidades.js';


Medicos.belongsTo(Especialidades, {
  foreignKey: 'especialidadeId',
  as: 'especialidade'
});


Especialidades.hasMany(Medicos, {
  foreignKey: 'especialidadeId',
  as: 'medicos'
});


Medicos.belongsTo(Cidades, {
  foreignKey: 'cidadeId',
  as: 'cidade'
});


Cidades.hasMany(Medicos, {
  foreignKey: 'cidadeId',
  as: 'medicos'
});

export {
  sequelize,
  Usuarios,
  Medicos,
  Especialidades,
  Cidades
};

import express from 'express';
import { Especialidades, sequelize } from './models/index.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Ok' });
});

app.post('/especialidades', async (req, res) => {
  try{
    const especialidade = await Especialidades.create(req.body);
    res.status(201).json(especialidade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/especialidades', async (req, res) => {
  try {
    const especialidades = await Especialidades.findAll();
    res.status(200).json(especialidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/especialidades/:id', async (req, res) => {
  try {
    const especialidade = await Especialidades.findByPk(req.params.id);
    if (especialidade) {
      res.status(200).json(especialidade);
    } else {
      res.status(404).json({ error: 'Especialidade não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/especialidades/:id', async (req, res) => {
  try {
    const especialidade = await Especialidades.findByPk(req.params.id);
    if (especialidade) {
      await especialidade.destroy();
       return res.status(200).json({ message: 'Especialidade deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Especialidade não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sincronizar banco de dados e iniciar servidor
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch((error) => {
  console.error('Erro ao sincronizar banco de dados:', error);
});
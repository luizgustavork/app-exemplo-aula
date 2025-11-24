import express from 'express';
import { Op } from 'sequelize';
import { Cidades, Especialidades, Medicos, sequelize } from './models/index.js';

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
try{
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

app.delete ('/especialidades/:id', async (req, res) => {
  try{
    const especialidade = await Especialidades.findByPk(req.params.id);
    if(especialidade) {
      await especialidade.destroy();
        return res.status(200).json({ message: 'Especialidade deletada com sucesso' })
    } else {
      res.status(404).json ({ error: 'Especialidade não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/cidades', async (req, res) => {
  try{
    const cidade = await Cidades.create(req.body);
    res.status(201).json(Cidades);
  } catch (error) {
  res.status(400).json({ error: error.message });
  }
});

app.get('/cidades', async (req, res) => {
try{
  const cidades = await Cidades.findAll();
  res.status(200).json(cidades);
} catch (error) {
  res.status(500).json({ error: error.message });
  }
});

app.get('/cidades/:id', async (req, res) => {
 try {
  const cidade = await Cidades.findByPk(req.params.id);
  if (cidade) {
    res.status(200).json(cidade);
  } else {
    res.status(404).json({ error: 'Cidade não encontrada' });
  }
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
});

app.delete ('/cidades/:id', async (req, res) => {
  try{
    const cidade = await Cidades.findByPk(req.params.id);
    if(cidade) {
      await cidade.destroy();
        return res.status(200).json({ message: 'Cidade deletada com sucesso' })
    } else {
      res.status(404).json ({ error: 'Cidade não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/medicos', async (req, res) => {
  try{
    const medico = await Medicos.create(req.body);
    res.status(201).json(medico);
  } catch (error) {
  res.status(400).json({ error: error.message });
  }
});

app.get('/medicos', async (req, res) => {
try{
  const medicos = await Medicos.findAll();
  res.status(200).json(medicos);
} catch (error) {
  res.status(500).json({ error: error.message });
  }
});

app.get('/medicos/:id', async (req, res) => {
 try {
  const medico = await Medicos.findByPk(req.params.id);
  if (medico) {
    res.status(200).json(medico);
  } else {
    res.status(404).json({ error: 'Médico não encontrado' });
  }
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
});

app.delete ('/medicos/:id', async (req, res) => {
  try{
    const medico = await Medicos.findByPk(req.params.id);
    if(medico) {
      await medico.destroy();
        return res.status(200).json({ message: 'Médico deletado com sucesso' })
    } else {
      res.status(404).json ({ error: 'Médico não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/medicos/busca'), async (req, res) => {
  try {
    const { especialidadeId, cidadeId } = req.query;
    const where = {}
    if (especialidadeId) where.especialidadeId = especialidadeId;
    if (cidadeId) where.cidadeId = cidadeId;
    const medicos = await Medicos.findAll({
      where,
      include: [
        { model: Especialidades, as: 'especialidade' },
        { model: Cidades, as: 'cidade' }
      ]
    });
    res.json(medicos);
  } catch (error) {
    res.status(500).json({ error: error.message });
}}

// Rota de busca avançada de médicos
app.get('/api/v1/search/medicos', async (req, res) => {
  try {
    const { especialidade, cidade, nome } = req.query;

    const where = {};
    if (nome) {
      where.nome = { [Op.like]: `%${nome}%` };
    }

    const include = [
      {
        model: Especialidades,
        as: 'especialidade',
        where: especialidade ? { nome: especialidade } : undefined,
        required: !!especialidade
      },
      {
        model: Cidades,
        as: 'cidade',
        where: cidade ? { nome: cidade } : undefined,
        required: !!cidade
      }
    ];

    const medicos = await Medicos.findAll({ where, include });
    res.status(200).json(medicos);
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

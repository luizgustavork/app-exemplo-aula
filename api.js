import express from 'express';
// 1. Correção de Importação: Incluindo Medicos, Cidades e Op
import { Especialidades, Medicos, Cidades, sequelize } from './models/index.js';
import { Op } from 'sequelize'; 

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
      return res.status(204).json({ message: 'Especialidade deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Especialidade não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- INSERIR ENDPOINT DE BUSCA COMPLEXA AQUI ---

/**
 * 2. Endpoint de Busca Complexa de Médicos
 * GET /api/v1/search/doctors
 * @param {string} specialty - Nome parcial ou completo da especialidade.
 * @param {string} city - Nome parcial ou completo da cidade.
 * @param {string} name - Nome parcial ou completo do médico.
 */
app.get('/api/v1/search/doctors', async (req, res) => {
    // Extrai parâmetros de consulta (opcionais)
    const { specialty, city, name } = req.query;

    // Configuração inicial da cláusula WHERE para o modelo Medicos
    const medicoWhere = {};
    if (name) {
        // Busca parcial, sem distinção de maiúsculas e minúsculas
        medicoWhere.nome = { [Op.like]: `%${name}%` };
    }

    // Configuração da cláusula INCLUDE para JOINs condicionais
    const includeClauses = [
        {
            model: Especialidades,
            as: 'Especialidade', // Assegure-se que 'Especialidade' é o alias correto da associação
            attributes: ['nome'],
            // required: true SÓ SE houver filtro. Padrão é LEFT JOIN (required: false).
        },
        {
            model: Cidades,
            as: 'Cidade', // Assegure-se que 'Cidade' é o alias correto da associação
            attributes: ['nome', 'estado'],
        },
    ];

    // Adiciona filtro de Especialidade
    if (specialty) {
        // Encontra o objeto 'include' da especialidade e adiciona 'where' e 'required: true'
        const especialidadeInclude = includeClauses.find(i => i.model === Especialidades);
        especialidadeInclude.where = { nome: { [Op.like]: `%${specialty}%` } };
        especialidadeInclude.required = true; // INNER JOIN quando o filtro de especialidade está presente
    }

    // Adiciona filtro de Cidade
    if (city) {
        // Encontra o objeto 'include' da cidade e adiciona 'where' e 'required: true'
        const cidadeInclude = includeClauses.find(i => i.model === Cidades);
        cidadeInclude.where = { nome: { [Op.like]: `%${city}%` } };
        cidadeInclude.required = true; // INNER JOIN quando o filtro de cidade está presente
    }

    try {
        const doctors = await Medicos.findAll({
            where: medicoWhere, // Aplica filtro de nome do médico
            include: includeClauses, // Aplica JOINs condicionais e filtros associados
            attributes: { exclude: ['EspecialidadeId', 'CidadeId', 'createdAt', 'updatedAt'] } // Limpa a saída
        });

        if (doctors.length === 0) {
            return res.status(404).json({ message: 'Nenhum médico encontrado com os critérios fornecidos.' });
        }
        
        // Retorna os dados com status 200
        res.status(200).json(doctors);
    } catch (error) {
        console.error('Erro na busca de médicos:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar médicos.' });
    }
});

// --- FUNÇÃO DE SEEDING ---
const runSeeding = async () => {
    try {
        // Criação das Especialidades
        const cardiologia = await Especialidades.create({ nome: 'Cardiologia' });
        const dermatologia = await Especialidades.create({ nome: 'Dermatologia' });
        const pediatria = await Especialidades.create({ nome: 'Pediatria' });
        const clinicaGeral = await Especialidades.create({ nome: 'Clínica Geral' });

        // Criação das Cidades
        const sp = await Cidades.create({ nome: 'São Paulo', estado: 'SP' });
        const apucarana = await Cidades.create({ nome: 'Apucarana', estado: 'PR' });
        const rj = await Cidades.create({ nome: 'Rio de Janeiro', estado: 'RJ' });

        // Criação dos Médicos (pelo menos três)
        await Medicos.bulkCreate([
            {
                nome: 'Dr. João Silva',
                crm: 'SP123456',
                EspecialidadeId: cardiologia.id,
                CidadeId: sp.id
            },
            {
                nome: 'Dra. Maria Oliveira',
                crm: 'PR789012',
                EspecialidadeId: dermatologia.id,
                CidadeId: apucarana.id
            },
            {
                nome: 'Dr. Pedro Santos',
                crm: 'RJ345678',
                EspecialidadeId: pediatria.id,
                CidadeId: rj.id
            },
            {
                nome: 'Dra. Ana Costa',
                crm: 'SP901234',
                EspecialidadeId: clinicaGeral.id,
                CidadeId: sp.id
            }
        ]);

        console.log('Dados de seed inseridos com sucesso.');
    } catch (error) {
        console.error('Erro no seeding:', error);
    }
};

// Sincronizar banco de dados e iniciar servidor
sequelize.sync({ force: true }).then(() => { // force: true para facilitar testes e seed
  console.log('Banco de dados sincronizado');
  // --- INSERIR LÓGICA DE SEEDING AQUI ---
  runSeeding().then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Teste a busca em: http://localhost:${PORT}/api/v1/search/doctors?city=Paulo&specialty=cardio&name=jo`);
      });
  });
}).catch((error) => {
  console.error('Erro ao sincronizar banco de dados:', error);
});

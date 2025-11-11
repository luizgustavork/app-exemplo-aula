import express from 'express';
import sequelize from './config/database.js'

const app = express();
const PORT = 3000;
    

app.use(express.json())


app.get('/health', (req, res) => {
    res.status(200).json({status: 'Ok'})
});

app.listen(PORT, () =>{

    console.log('App rodando!')
})

var port = 4000;

sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');
  app.listen(port, () => {
    console.log(`App Rodando`);
  });
}).catch((error) => {
  console.error('Erro ao sincronizar banco de dados:', error);
});
import express from 'express';

const app = express();
const PORT = 3000;

const nomes = [];

app.use(express.json())

app.post('/api/nomes', (req, res) =>{

    const{nome} = req.body
    if(!nome){
        return res.status(404).json({error: 'Nome obrigatorio, tente novamente'})    
    }
    nomes.push(nome);
    res.status(201).json({message: 'nome adicionado com sucesso', nome, total: nomes.length})    
})

app.get('/api/nomes', (req, res) =>{
    res.status(200).json({nomes, total: nomes.length})
})

app.get('/health', (req, res) => {
    res.status(200).json({status: 'Ok'})
});

app.listen(PORT, () =>{

    console.log('App rodando!')
})
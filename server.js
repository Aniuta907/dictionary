import express from 'express'
import mongodb from 'mongodb'
import bodyParser from 'body-parser'
import fs from 'fs'
import * as path from 'path';

const __dirname = path.resolve();
const app = express()
const port = 5000
const { MongoClient } = mongodb;

const conn =  await MongoClient.connect('mongodb://root:example@mongo:27017/test?authSource=admin', {newUrlParser: true, useUnifiedTopology:true});
const db = conn.db('test');

fs.readFile('dictionary.json', async function (err, data) {
    const dictionary = JSON.parse(data)
    await db.collection('dictionary').insertMany(dictionary)
})

app.set('view engine', 'pug');
app.use(bodyParser.json());

app.post('/add-word', async (req, res) => {
    if (Object.keys(req.body).length > 0) {
        const {name, value} = req.body;
        await db.collection('dictionary').insertOne({name, value})
        res.send('Термин добавлен в словарь')
    } else {
        res.send('Что-то пошло не так. Пожалуйста, попробуйте ещё раз')
    }
})

app.get('/mindmap', (req, res) => {
    res.sendFile(path.join(__dirname, 'mindmap.png'));
})

app.get('/:word', async (req, res) => {

 const word = req.params.word;

 let result = await db.collection('dictionary').findOne({name: word});
 if (result) {
     const {name, value} = result;
     res.render('index', {title: 'Словарь', name, value});
 } else {
     res.render('form', {title: 'Словарь'})
 }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
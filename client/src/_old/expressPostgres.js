//import "./style.scss";
const { Client } = require('pg');
const express = require('express');
const app = express();

app.post('/ptodos', async (req, res) => {
  let result = {};
  try {
    const reqjson = req.body;
    await addData('tone');
    result.success = true
  } 
  catch (e) {
    result.success = false
  } 
  finally{
    res.setHeader("content-type", "application-json");
    res.setHeader("Content-Security-Policy", "self");
    res.send(JSON.stringify(result.success));
  }
})

app.get('/todos', async (req, res) => {
  const rows = await getData();
  res.setHeader("content-type", "application/json")
  res.send(JSON.stringify(rows));
})

app.get('/test', async (req, res) => {
  //res.sendFile(`${__dirname}/index.html`);
  res.send(`<h1>${__dirname}</h1>`);
  //res.send('<h1>Hello World!</h1>')
})

app.listen(8080, () => console.log('listening on 8080'))

const client = new Client({
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'brackets'
})

start();

async function start() {
  await connect();
  console.log('connected!');

  // let data = await getData();
  // console.table(data);
  // await addData('karma');
  // await deleteData('12');
  // data = await getData();
  // console.table(data);
  // await disconnect();
  // console.log('disconnected!')
}

async function connect() {
  try {
    await client.connect();
  } catch (e) {
    console.error(`failed to connect ${e}`)
  }
}

async function getData() {
  try {
    const results = await client.query(`SELECT * FROM public."testTable"`);
    return results.rows
  } catch (e) {
    return [];
  }
}
async function addData(name) {
  try {
    client.query(`INSERT INTO public."testTable" values (12, '${name}')`);
    console.log('adding data');
  } catch (e) {
    console.error(`error inserting data: ${e}`)
  }
}

async function deleteData(id) {
  try {
    client.query(`delete from public."testTable" where id='${id}'`)
  } catch (e) {
    console.error(`error deleting data: ${e}`);
  }
}

async function disconnect() {
  try {
    await client.end();
  } catch (e) {
    console.error(`couldn't disconnect because ${e}`)
  }
}
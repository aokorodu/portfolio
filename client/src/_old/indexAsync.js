//import "./style.scss";
const { Client } = require('pg');

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

  let data = await getData();
  console.table(data);
  // await addData('karma');
  await deleteData('12');
  data = await getData();
  console.table(data);
  await disconnect();
  console.log('disconnected!')
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
  } catch(e){
    console.error(`error inserting data: ${e}`)
  }
}

async function deleteData(id) {
  try{
    client.query(`delete from public."testTable" where id='${id}'`)
  } catch(e){
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
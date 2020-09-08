//import "./style.scss";
const {Client} = require('pg');

const client = new Client({
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'brackets'
});

client.connect()
.then(() => console.log('this is fullTable.js. yo yo, connected!'))
.then(()=> client.query('SELECT * from public."testTable"'))
.then(results => console.table(results.rows))
.finally(() => client.end())
.catch(e => console.log('error:', e))

const {Client} = require('pg');

const client = new Client({
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'brackets'
});

client.connect()
.then(() => console.log('yo yo, connected!'))
.then(() => client.query(`insert into public."testTable" values (6, 'corann')`))
// .then(() => client.query('insert into public."testTable" values ($1, $2)', [5, 'joanne']))
.then(()=> client.query('SELECT * from public."testTable"'))
.then(results => console.table(results.rows))
.finally(() => client.end())
.catch(e => console.log('error:', e))
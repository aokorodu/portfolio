const {Client} = require('pg');

const client = new Client({
  user:'root',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'brackets'
})

client.connect()
.then(() => {
  client.query('BEGIN');
  client.query(`insert into public."testTable" values (7, 'abe')`);
  client.query(`insert into public."testTable" values (8, 'deb')`);
  client.query(`insert into public."testTable" values (9, 'yon')`);
  client.query(`insert into public."testTable" values (10, 'chris')`);
  client.query(`insert into public."testTable" values (11, 'tse')`);
  client.query("COMMIT");
})
.then(() => client.query('select * from public."testTable"'))
.then((res)=> console.table(res.rows))
.finally(() => client.end())
.catch(e => console.log('error:', e));
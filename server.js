const { Pool, Client } = require('pg');

const connectionString = 'postgresql://postgres:admin@localhost:5432/testdb'

const pool = new Pool({
  connectionString,
})

pool.query('SELECT * FROM book', (err, res) => {
  console.log(res)
  pool.end()
})  
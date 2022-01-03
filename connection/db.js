const { Pool } = require('pg')

const dbPool = new Pool({
	database: 'ahsansanblog',
	port: 5432,
	user: 'postgres',
	password: 'root'
})

module.exports = dbPool
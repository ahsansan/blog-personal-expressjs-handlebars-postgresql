const { Pool } = require('pg')

const dbPool = new Pool({
	connectionString: 'postgres://cuvaijogdusulm:c1fc937077b7f7a56c006bc2e4e9e2d07db25f6ddd154225b11454448a8b1322@ec2-3-214-190-189.compute-1.amazonaws.com:5432/d6p1umdigaigfe',
	ssl: { rejectUnauthorized: false}
})

module.exports = dbPool
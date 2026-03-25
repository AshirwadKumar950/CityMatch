const { Pool } = require("pg");

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

const query = (text, params) => pool.query(text, params);

const initDB = async () => {
	await query(`
		CREATE TABLE IF NOT EXISTS citymatch_users (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(150) UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT NOW()
		)
	`);
};

module.exports = {
	pool,
	query,
	initDB,
};

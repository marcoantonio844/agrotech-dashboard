// src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect', () => {
    console.log('✅ Base de Dados conectada com sucesso!');
});

pool.on('error', (err) => {
    console.error('❌ Erro inesperado no cliente inativo', err);
    process.exit(-1);
});

module.exports = pool;
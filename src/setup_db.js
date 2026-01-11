// src/setup_db.js
const pool = require('./config/db');

const createTables = async () => {
    const queryText = `
        -- Tabela de Fazendas
        CREATE TABLE IF NOT EXISTS farms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255),
            size_hectares FLOAT
        );

        -- Tabela de Plantações
        CREATE TABLE IF NOT EXISTS crops (
            id SERIAL PRIMARY KEY,
            farm_id INTEGER REFERENCES farms(id),
            name VARCHAR(100) NOT NULL,
            planting_date DATE,
            expected_harvest_date DATE,
            status VARCHAR(50)
        );

        -- Tabela de Sensores
        CREATE TABLE IF NOT EXISTS sensors (
            id SERIAL PRIMARY KEY,
            crop_id INTEGER REFERENCES crops(id),
            type VARCHAR(50),
            identifier_code VARCHAR(50) UNIQUE
        );

        -- Tabela de Leituras (Dados dos Sensores)
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id SERIAL PRIMARY KEY,
            sensor_id INTEGER REFERENCES sensors(id),
            value FLOAT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabela de Alertas
        CREATE TABLE IF NOT EXISTS alerts (
            id SERIAL PRIMARY KEY,
            crop_id INTEGER REFERENCES crops(id),
            message TEXT NOT NULL,
            severity VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_resolved BOOLEAN DEFAULT FALSE
        );
    `;

    try {
        console.log("⏳ Criando tabelas no banco...");
        await pool.query(queryText);
        console.log("✅ Todas as tabelas foram criadas com sucesso!");
        pool.end(); // Fecha a conexão
    } catch (err) {
        console.error("❌ Erro ao criar tabelas:", err);
        pool.end();
    }
};

createTables();
// src/seed.js
const pool = require('./config/db');

const seedDatabase = async () => {
    try {
        console.log("🌱 Plantando dados de teste...");

        // 1. Criar uma Fazenda
        const farmRes = await pool.query(`
            INSERT INTO farms (name, location, size_hectares) 
            VALUES ($1, $2, $3) RETURNING *`, 
            ['Fazenda Tech Sul', 'Paraná, BR', 1500.50]
        );
        const farmId = farmRes.rows[0].id;
        console.log(`✅ Fazenda criada: ${farmRes.rows[0].name}`);

        // 2. Criar Plantações
        const cropsRes = await pool.query(`
            INSERT INTO crops (farm_id, name, planting_date, expected_harvest_date, status) 
            VALUES 
            ($1, 'Soja Transgênica', '2023-11-01', '2024-03-15', 'Saudável'),
            ($1, 'Milho Safrinha', '2023-12-10', '2024-05-20', 'Risco de Praga')
            RETURNING *`, 
            [farmId]
        );
        console.log(`✅ ${cropsRes.rowCount} Plantações criadas.`);

        // 3. Adicionar Sensores para a primeira plantação (Soja)
        const cropId = cropsRes.rows[0].id;
        const sensorsRes = await pool.query(`
            INSERT INTO sensors (crop_id, type, identifier_code) 
            VALUES 
            ($1, 'Umidade do Solo', 'SENS-UMID-001'),
            ($1, 'Temperatura', 'SENS-TEMP-022')
            RETURNING *`, 
            [cropId]
        );
        console.log(`✅ ${sensorsRes.rowCount} Sensores instalados.`);

        // 4. Gerar Leituras Falsas (Histórico)
        const sensorId = sensorsRes.rows[0].id; // Sensor de Umidade
        // Gera 5 leituras aleatórias
        for (let i = 0; i < 5; i++) {
            await pool.query(`
                INSERT INTO sensor_readings (sensor_id, value, timestamp) 
                VALUES ($1, $2, NOW() - INTERVAL '${i} hours')`, 
                [sensorId, (Math.random() * 100).toFixed(2)]
            );
        }
        console.log("✅ Leituras dos sensores geradas.");

        console.log("🚀 Banco de dados populado com sucesso! Pronto para o Frontend.");
        pool.end();
    } catch (err) {
        console.error("❌ Erro ao popular banco:", err);
        pool.end();
    }
};

seedDatabase();
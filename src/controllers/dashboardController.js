// src/controllers/dashboardController.js
const pool = require('../config/db');

const getFarmSummary = async (req, res) => {
    try {
        // Dados do Banco
        const farmQuery = await pool.query('SELECT * FROM farms LIMIT 1');
        const cropsQuery = await pool.query('SELECT * FROM crops');
        const alertsQuery = await pool.query('SELECT * FROM alerts WHERE is_resolved = false');

        // Dados de Pecuária
        const livestockData = [
            { id: 101, tag: 'BOI-902', weight: 580, status: 'Saudável', location: 'Pasto A' },
            { id: 102, tag: 'BOI-905', weight: 565, status: 'Alerta', location: 'Pasto A' },
            { id: 103, tag: 'VACA-202', weight: 420, status: 'Saudável', location: 'Confinamento' },
            { id: 104, tag: 'VACA-208', weight: 410, status: 'Saudável', location: 'Confinamento' },
        ];

        // Dados de Silos
        const silosData = [
            { type: 'Silo A (Soja)', capacity: 1000, current: 750, temp: 18.5 },
            { type: 'Silo B (Milho)', capacity: 1000, current: 200, temp: 22.1 },
        ];

        // --- NOVO: DADOS DE MAQUINÁRIO ---
        const machineryData = [
            { id: 1, name: 'Trator JD-8R', type: 'Pesado', status: 'Operando', fuel: 78, next_maintenance: '200h' },
            { id: 2, name: 'Colheitadeira S700', type: 'Colheita', status: 'Manutenção', fuel: 15, next_maintenance: 'IMEDIATA' },
            { id: 3, name: 'Pulverizador 4030', type: 'Defensivo', status: 'Parado', fuel: 98, next_maintenance: '500h' },
        ];

        // Dados Financeiros
        const marketData = { soy_price: 128.50, corn_price: 58.20, cattle_price: 235.00 };

        res.json({
            farm: farmQuery.rows[0],
            crops: cropsQuery.rows,
            active_alerts: alertsQuery.rowCount,
            livestock: livestockData,
            silos: silosData,
            machinery: machineryData, // Enviando as máquinas
            market: marketData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro controller" });
    }
};

const getSensorReadings = async (req, res) => {
    try {
        const results = await pool.query(`SELECT sr.value, sr.timestamp FROM sensor_readings sr ORDER BY sr.timestamp DESC LIMIT 10`);
        res.json(results.rows);
    } catch (err) { console.error(err); res.status(500).json({ error: "Erro sensor" }); }
};

module.exports = { getFarmSummary, getSensorReadings };
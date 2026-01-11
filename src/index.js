// src/index.js
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes'); // Importa a ponte

const app = express();

app.use(express.json());
app.use(cors());

// Usa as rotas que criamos
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend rodando na porta ${PORT}`);
    console.log(`🔗 Link de teste: http://localhost:3000/api/dashboard`);
});
import { NextResponse } from 'next/server';

// SIMULAÇÃO DE UM BANCO DE DADOS (JSON)
// Num projeto real, aqui você conectaria no MongoDB ou PostgreSQL
const db = {
    market: { soy_price: 132.50, corn_price: 65.20, cattle_price: 245.00 },
    crops: [
        { id: 1, name: 'Soja (Talhão A)', status: 'Saudável', expected_harvest_date: '2025-03-15' },
        { id: 2, name: 'Milho (Talhão B)', status: 'Atenção', expected_harvest_date: '2025-04-20' }
    ],
    livestock: [
        { id: 1, tag: 'BR-0102', weight: 450, status: 'Saudável', location: 'Pasto 04' },
        { id: 2, tag: 'BR-0355', weight: 420, status: 'Doente', location: 'Enfermaria' }
    ],
    active_alerts: 3,
    machinery: [
        { id: 1, name: 'Trator JD-8R', type: 'Pesado', status: 'Operando', fuel: 75, next_maintenance: '15/12' },
        { id: 2, name: 'Colheitadeira S700', type: 'Colheita', status: 'Manutenção', fuel: 10, next_maintenance: 'HOJE' },
        { id: 3, name: 'Drone Pulverizador', type: 'Aéreo', status: 'Operando', fuel: 90, next_maintenance: '20/12' }
    ],
    silos: [
        { type: 'Silo 1 (Soja)', capacity: 1000, current: 850, temp: 24 },
        { type: 'Silo 2 (Milho)', capacity: 1000, current: 300, temp: 22 },
        { type: 'Silo 3 (Reserva)', capacity: 800, current: 0, temp: 20 }
    ]
};

export async function GET() {
    // Simula um delay de banco de dados real (opcional)
    // await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(db);
}
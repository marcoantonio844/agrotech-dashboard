// frontend/src/components/FarmMap.js
"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correção para ícones do Leaflet no Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function FarmMap() {
  // Coordenadas fictícias (Centro de uma fazenda no Paraná)
  const position = [-24.95, -53.46]; 

  return (
    <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl relative z-0">
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        {/* Mapa Escuro (Dark Mode) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Marcador da Sede */}
        <Marker position={position} icon={icon}>
          <Popup className="text-black font-bold">📍 Sede da Fazenda Tech Sul</Popup>
        </Marker>

        {/* Círculo da Área de Soja (Setor Norte) */}
        <Circle 
          center={[-24.94, -53.45]} 
          pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }} 
          radius={800}
        >
          <Popup>🌱 Setor Norte: Soja (Irrigação Ativa)</Popup>
        </Circle>

        {/* Círculo da Área de Milho (Setor Sul) */}
        <Circle 
          center={[-24.96, -53.47]} 
          pathOptions={{ color: 'yellow', fillColor: 'yellow', fillOpacity: 0.2 }} 
          radius={600}
        >
          <Popup>🌽 Setor Sul: Milho (Alerta de Praga)</Popup>
        </Circle>
      </MapContainer>
    </div>
  );
}
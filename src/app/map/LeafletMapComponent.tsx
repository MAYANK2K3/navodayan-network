"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CityData } from "@/types";

interface LeafletMapComponentProps {
  cities: CityData[];
  onSelectCity: (city: CityData) => void;
}

// Fix default leaflet marker icon issue in Next.js
const customMarkerIcon = (count: number) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background: linear-gradient(135deg, #1E3A8A 0%, #0B132B 100%);
        color: #F59E0B;
        border: 2px solid #F59E0B;
        border-radius: 9999px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 800;
        box-shadow: 0 4px 12px rgba(11, 19, 43, 0.4);
      ">
        ${count > 999 ? "1k+" : count}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export default function LeafletMapComponent({ cities, onSelectCity }: LeafletMapComponentProps) {
  return (
    <MapContainer
      center={[22.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cities.map((city) => (
        <Marker
          key={`${city.city}-${city.country}`}
          position={[city.latitude, city.longitude]}
          icon={customMarkerIcon(city.alumni_count || 100)}
          eventHandlers={{
            click: () => onSelectCity(city),
          }}
        >
          <Popup>
            <div className="p-1 text-slate-900">
              <div className="font-bold text-xs">{city.city}</div>
              <div className="text-[10px] text-slate-500">
                {city.state}, {city.country}
              </div>
              <div className="text-[11px] font-bold text-amber-600 mt-1">
                {city.alumni_count || 100}+ Navodayans
              </div>
              <button
                onClick={() => onSelectCity(city)}
                className="mt-2 w-full py-1 px-2 text-[10px] font-bold text-white bg-blue-900 rounded"
              >
                View Members
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

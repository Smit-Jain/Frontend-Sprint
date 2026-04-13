import { MapContainer, TileLayer, Circle, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in Leaflet with Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function InteractiveMap({ latitude, longitude, activeFloods }) {
  // If data isn't ready
  if (!latitude || !longitude) return null;

  return (
    <div className="glass-panel" style={{ height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      {/* We need MapContainer to have height 100% to fill the glass panel */}
      <MapContainer 
        center={[latitude, longitude]} 
        zoom={10} 
        style={{ flexGrow: 1, width: '100%', borderRadius: '15px' }}
      >
        {/* Dark theme styled map from CartoDB */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Primary Location Marker */}
        <Marker position={[latitude, longitude]}>
          <Popup>
            Target Location Sector
          </Popup>
        </Marker>

        {/* Hazard Overlay Ring (Simulating Flood/Weather danger zones) */}
        {activeFloods > 0 && (
          <Circle 
            center={[latitude, longitude]} 
            pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.2 }} 
            radius={8000} // Radius in meters
          >
            <Popup>Active Regional Hazards Detected: {activeFloods}</Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
}

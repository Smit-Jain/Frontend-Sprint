import { Thermometer, Wind, Droplets, CloudRain } from 'lucide-react';

export default function EnvironmentalRiskWidget({ data }) {
  if (!data) return null;

  const { temperature_2m, wind_speed_10m, precipitation, relative_humidity_2m } = data;

  return (
    <div className="flex-col gap-6">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Thermometer className="text-danger" /> Local Metrology
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Temperature Card display */}
        <div className="glass-panel flex-col items-center justify-center text-center">
          <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Temperature</div>
          <div className="metric-value">{temperature_2m ?? '--'}°C</div>
        </div>
        
        {/* Wind Speed */}
        <div className="glass-panel flex-col items-center justify-center text-center">
          <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
            <Wind size={16} /> Wind
          </div>
          <div className="metric-value">{wind_speed_10m ?? '--'} <span className="text-lg opacity-70">km/h</span></div>
        </div>

        {/* Humidity */}
        <div className="glass-panel flex-col items-center justify-center text-center">
          <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
            <Droplets size={16} /> Humidity
          </div>
          <div className="metric-value">{relative_humidity_2m ?? '--'} <span className="text-lg opacity-70">%</span></div>
        </div>

        {/* Precipitation */}
        <div className="glass-panel flex-col items-center justify-center text-center">
          <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
            <CloudRain size={16} /> Rain
          </div>
          <div className="metric-value">{precipitation ?? '--'} <span className="text-lg opacity-70">mm</span></div>
        </div>
      </div>
    </div>
  );
}

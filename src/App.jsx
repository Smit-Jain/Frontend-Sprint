import { useState, useEffect } from 'react';
import Header from './components/Header';
import EnvironmentalRiskWidget from './components/EnvironmentalRiskWidget';
import SmartResponsePanel from './components/SmartResponsePanel';
import InteractiveMap from './components/InteractiveMap';
import AdviceTicker from './components/AdviceTicker';
import { fetchEnvironmentalData, fetchFloodData, getSmartResponse } from './services/api';
import './index.css';
import { RefreshCw, Search, Volume2, Navigation } from 'lucide-react';

function App() {
  // Data States
  const [environmentalData, setEnvironmentalData] = useState(null);
  const [floodData, setFloodData] = useState(null);
  const [groqResponse, setGroqResponse] = useState(null);
  const [error, setError] = useState('');
  
  // UI States
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Location States
  const [cityInput, setCityInput] = useState('');
  const [targetLat, setTargetLat] = useState(51.5085); // Default London
  const [targetLon, setTargetLon] = useState(-0.1257);

  const performSweep = async (lat, lon) => {
    setIsFetchingData(true);
    setIsAnalyzing(true);
    setError('');
    
    try {
      const weather = await fetchEnvironmentalData(lat, lon);
      const floods = await fetchFloodData(); // Simulating regional floods
      setEnvironmentalData(weather);
      setFloodData(floods);
      setIsFetchingData(false);

      const analysis = await getSmartResponse(weather, floods);
      setGroqResponse(analysis);
    } catch (err) {
      console.error(err);
      setError('System failure while retrieving tactical data.');
    } finally {
      setIsFetchingData(false);
      setIsAnalyzing(false);
    }
  };

  // Run on mount
  useEffect(() => {
    performSweep(targetLat, targetLon);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cityInput) return;
    
    setIsFetchingData(true);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1`);
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude } = geoData.results[0];
        setTargetLat(latitude);
        setTargetLon(longitude);
        performSweep(latitude, longitude);
      } else {
        setError(`Sector [${cityInput}] not found in database.`);
        setIsFetchingData(false);
      }
    } catch (err) {
      setError('Geocoding uplink failed.');
      setIsFetchingData(false);
    }
  };

  const engageAutoNav = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your terminal.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTargetLat(position.coords.latitude);
        setTargetLon(position.coords.longitude);
        setCityInput('LOCAL SATELLITE LOCK');
        performSweep(position.coords.latitude, position.coords.longitude);
      },
      () => setError("Failed to acquire local satellite lock.")
    );
  };

  const broadcastAudio = () => {
    if (!groqResponse?.analysis || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(`Tactical Level ${groqResponse.threatString}. ${groqResponse.analysis.replace(/\*\*/g, '')}`);
    utterance.volume = 1;
    utterance.rate = 0.9;
    utterance.pitch = 0.8; // slightly lower pitch for seriousness
    window.speechSynthesis.speak(utterance);
  };

  const threatLevel = groqResponse?.threatLevel || 1;

  return (
    <>
      {/* Background glow depends on threat level */}
      <div className={`theme-${threatLevel}`} style={{ minHeight: '100vh', transition: 'background 1s, box-shadow 1s', paddingBottom: '3rem' }}>
        <Header />
        
        <main className="container">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
             {/* Search Bar */}
             <form onSubmit={handleSearch} className="flex gap-2 w-full justify-start">
               <div className="search-wrapper">
                 <input 
                   type="text" 
                   value={cityInput}
                   onChange={e => setCityInput(e.target.value)}
                   placeholder="Enter global sector (City)..." 
                   className="search-input"
                 />
                 <Search className="search-icon" size={16} />
               </div>
               <button type="button" onClick={engageAutoNav} className="btn btn-icon" title="Auto Geolocation">
                 <Navigation size={16} />
               </button>
             </form>

            <div className="flex gap-2">
              <button 
                className="btn btn-icon font-mono text-xs"
                onClick={broadcastAudio}
                disabled={isAnalyzing || !groqResponse}
                title="Broadcast Audio"
              >
                <Volume2 size={16} /> EMER-COMMS
              </button>
              <button 
                className="btn font-mono uppercase tracking-widest text-xs"
                onClick={() => performSweep(targetLat, targetLon)}
                disabled={isFetchingData || isAnalyzing}
              >
                <RefreshCw size={14} className={(isFetchingData || isAnalyzing) ? 'animate-spin' : ''} />
                Execute Sweep
              </button>
            </div>
          </div>

          {error && (
            <div className="glass-panel text-danger mb-4 font-mono font-bold" style={{ borderColor: 'var(--danger-color)' }}>
              [SYS_ERR] {error}
            </div>
          )}

          <div className="dashboard-grid">
            {/* Left Column: Metrics & Map */}
            <div className="flex-col gap-6" style={{ display: 'flex' }}>
              <div className="glass-panel">
                 {isFetchingData ? (
                   <div className="flex-col items-center justify-center p-8">
                     <div className="loader-cube" style={{ transform: 'scale(0.5)' }} />
                     <p className="text-secondary text-sm mt-2 font-mono">Calibrating sensors...</p>
                   </div>
                 ) : (
                   <EnvironmentalRiskWidget data={environmentalData?.current} />
                 )}
              </div>

              {/* Interactive Map */}
              <InteractiveMap latitude={targetLat} longitude={targetLon} activeFloods={floodData?.items?.length || 0} />
            </div>

            {/* Right Column: AI Analysis */}
            <div style={{ minHeight: '500px' }}>
               <SmartResponsePanel 
                 isLoading={isAnalyzing} 
                 analysisData={groqResponse}
                 error={error}
               />
            </div>
          </div>
        </main>
        
        <footer className="site-footer">
          <p>NexusCore Built for the User | Powered by Groq LPU & Open-Meteo</p>
        </footer>

        <AdviceTicker />
      </div>
    </>
  );
}

export default App;

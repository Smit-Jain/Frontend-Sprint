import { useEffect, useState } from 'react';
import { fetchAdvice } from '../services/api';

export default function AdviceTicker() {
  const [advice, setAdvice] = useState('Standby for intelligence...');

  useEffect(() => {
    const getWisdom = async () => {
      const text = await fetchAdvice();
      setAdvice(text);
    };
    getWisdom();
    // Fetch new advice every 15 seconds
    const interval = setInterval(getWisdom, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="advice-ticker-container">
      <div className="ticker-track">
        <span className="ticker-text font-mono text-sm opacity-70">
          [HQ TRANSMISSION] :: {advice} :: END TRANS
        </span>
      </div>
    </div>
  );
}

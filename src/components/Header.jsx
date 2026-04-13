import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header>
      {/* Overriding the default container padding vertically to make Header smaller */}
      <div className="container flex items-center justify-between" style={{ padding: '0 1rem' }}>
        <div className="flex items-center gap-2">
          <Activity className="text-accent" size={20} />
          <span className="logo-text text-lg">NexusCore</span>
        </div>
        
        <div className="live-indicator" style={{ padding: '0.15rem 0.6rem', fontSize: '0.75rem' }}>
          <div className="pulse-dot" style={{ width: '6px', height: '6px' }}></div>
          Live Systems
        </div>
      </div>
    </header>
  );
}

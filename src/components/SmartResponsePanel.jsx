import { ShieldAlert, Cpu } from 'lucide-react';

export default function SmartResponsePanel({ isLoading, analysisData, error }) {
  const { threatLevel, threatString, analysis } = analysisData || {};

  const formatResponse = (text) => {
    if (!text) return null;
    
    // Split into structural paragraphs by double-newline
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((para, paraIdx) => {
      const lines = para.split('\n');
      
      const renderLine = (lineContent) => {
         const parts = lineContent.split(/(\*\*.*?\*\*)/g);
         return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="text-accent text-lg">{part.slice(2, -2)}</strong>;
            }
            return part;
         });
      };

      return (
        <div key={paraIdx} style={{ marginBottom: '3rem' }}>
          {lines.map((line, inlineIdx) => (
             <div key={inlineIdx} style={{ marginBottom: '1.5rem', lineHeight: '2.2' }}>
               {renderLine(line)}
             </div>
          ))}
        </div>
      );
    });
  };

  const threatColorMap = {
    1: 'var(--success-color)',
    2: 'var(--warning-color)',
    3: 'var(--danger-color)',
    4: '#fff',
  };

  return (
    <div className={`glass-panel ${threatLevel ? `theme-${threatLevel}` : ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '3rem' }}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="text-primary" size={36} /> Tactical AI Analysis
        </h2>
        <Cpu className={`text-accent ${isLoading ? 'opacity-100 shimmer-text' : 'opacity-50'}`} size={36} />
      </div>

      {/* Visual Risk Meter */}
      {!isLoading && !error && threatString && threatLevel !== 0 && (
         <div className="flex items-center gap-4 mt-4 mb-10 p-5 rounded-xl border border-white/10" style={{ background: 'rgba(0,0,0,0.5)', borderLeft: `8px solid ${threatColorMap[threatLevel]}` }}>
           <span className="text-lg text-secondary font-mono tracking-widest uppercase">Risk Level:</span>
           <strong style={{ color: threatColorMap[threatLevel], fontSize: '2rem'}}>{threatString}</strong>
         </div>
      )}

      <div className="ai-response-content" style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {isLoading ? (
          <div className="flex-col items-center justify-center h-full">
            <div className="loader-cube" />
            <div className="text-center text-secondary shimmer-text font-semibold uppercase tracking-widest text-sm mt-4">
              Processing Environmental Data...
            </div>
          </div>
        ) : error ? (
          <div className="text-danger flex items-center gap-2 font-mono">
            <span>[SYS_ERR]</span> {error}
          </div>
        ) : analysis ? (
          <div className="font-mono text-sm" style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)' }}>
            {formatResponse(analysis)}
          </div>
        ) : (
          <div className="text-secondary italic text-center mt-10">
            Awaiting environmental sweep...
          </div>
        )}
      </div>
    </div>
  );
}

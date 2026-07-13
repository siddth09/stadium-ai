import React, { useState } from 'react';
import { StadiumZone, CrowdDensity } from '@/types';

interface StadiumMapProps {
  zones: readonly StadiumZone[];
}

const DENSITY_COLORS: Record<CrowdDensity, { fill: string; pulse: string }> = {
  [CrowdDensity.Low]: { fill: '#10B981', pulse: '#34D399' },
  [CrowdDensity.Moderate]: { fill: '#F59E0B', pulse: '#FCD34D' },
  [CrowdDensity.High]: { fill: '#EF4444', pulse: '#FC8181' },
  [CrowdDensity.Critical]: { fill: '#dc2626', pulse: '#ef4444' }, // deeper red
};

export const StadiumMap: React.FC<StadiumMapProps> = ({ zones }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const getZoneDensityColors = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return { fill: '#ffffff0a', stroke: '#ffffff22', pulse: '#ffffff', duration: '3s' };
    
    const colors = DENSITY_COLORS[zone.density];
    const duration = zone.density === CrowdDensity.Critical ? '0.8s' : zone.density === CrowdDensity.High ? '1.5s' : '3s';
    
    return {
      fill: colors.fill + '66', // 40% opacity
      stroke: colors.fill,
      pulse: colors.pulse,
      duration,
      zone
    };
  };

  // Modern Football Stadium Layout (500x350)
  const sections = [
    // North Stand (z-201)
    { id: 'z-201', label: 'North', path: 'M120,20 L380,20 L360,60 L140,60 Z', cx: 250, cy: 40 },
    // South Stand (z-conc)
    { id: 'z-conc', label: 'South', path: 'M140,290 L360,290 L380,330 L120,330 Z', cx: 250, cy: 310 },
    // East Stand (z-101)
    { id: 'z-101', label: 'East', path: 'M390,30 L480,70 L480,280 L390,320 Z', cx: 435, cy: 175 },
    // West Stand (z-exit-b)
    { id: 'z-exit-b', label: 'West', path: 'M110,30 L20,70 L20,280 L110,320 Z', cx: 65, cy: 175 },
    
    // Corners
    { id: 'z-vip', label: 'VIP', path: 'M25,60 L110,25 L130,55 L55,90 Z', cx: 75, cy: 55 }, // NW Corner
    { id: 'z-fc1', label: 'Food', path: 'M475,60 L390,25 L370,55 L445,90 Z', cx: 425, cy: 55 }, // NE Corner
    { id: 'z-fc2', label: 'Food', path: 'M25,290 L110,325 L130,295 L55,260 Z', cx: 75, cy: 295 }, // SW Corner
    { id: 'z-exit-a', label: 'Exit', path: 'M475,290 L390,325 L370,295 L445,260 Z', cx: 425, cy: 295 }, // SE Corner
  ];

  const facilityIcons = [
    { x: 250, y: 15, icon: '🚪', label: 'Gate North' },
    { x: 250, y: 345, icon: '🚪', label: 'Gate South' },
    { x: 435, y: 140, icon: '🚻', label: 'Restroom East (z-rr1)' },
    { x: 65, y: 140, icon: '🚻', label: 'Restroom West (z-rr2)' },
    { x: 250, y: 315, icon: '⚕️', label: 'Medical (z-med)' },
    { x: 65, y: 215, icon: '♿', label: 'Accessibility (z-acc)' },
  ];

  return (
    <div className="stadium-heatmap-container" style={{ width: '100%', marginBottom: '2rem' }}>
      <div className="glass-card-flat" style={{ padding: 'var(--space-md)', position: 'relative' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚽ Live Stadium Heatmap
        </h2>
        
        <svg
          viewBox="0 0 500 360"
          role="img"
          aria-label="FIFA World Cup Stadium crowd density heatmap"
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '450px' }}
        >
          <defs>
            <filter id="glow-strong">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Football pitch gradient */}
            <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
            {/* Stripe pattern for pitch */}
            <pattern id="pitchStripes" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="20" height="40" fill="#ffffff" fillOpacity="0.03" />
            </pattern>
          </defs>

          {/* Stadium Outer Base */}
          <rect width="500" height="360" fill="transparent" />

          {/* Football Pitch */}
          <g transform="translate(145, 65)">
            <rect width="210" height="220" fill="url(#pitchGrad)" rx="4" stroke="#ffffff44" strokeWidth="1.5" />
            <rect width="210" height="220" fill="url(#pitchStripes)" rx="4" />
            
            {/* Center Line */}
            <line x1="0" y1="110" x2="210" y2="110" stroke="#ffffffaa" strokeWidth="1.5" />
            {/* Center Circle */}
            <circle cx="105" cy="110" r="30" fill="none" stroke="#ffffffaa" strokeWidth="1.5" />
            {/* Center Dot */}
            <circle cx="105" cy="110" r="2" fill="#ffffff" />
            
            {/* Top Penalty Box */}
            <rect x="55" y="0" width="100" height="35" fill="none" stroke="#ffffffaa" strokeWidth="1.5" />
            {/* Top 6-yard Box */}
            <rect x="75" y="0" width="60" height="12" fill="none" stroke="#ffffffaa" strokeWidth="1.5" />
            {/* Top Penalty Arc */}
            <path d="M 85 35 A 20 20 0 0 0 125 35" fill="none" stroke="#ffffffaa" strokeWidth="1.5" />
            
            {/* Bottom Penalty Box */}
            <rect x="55" y="185" width="100" height="35" fill="none" stroke="#ffffffaa" strokeWidth="1.5" />
            {/* Bottom 6-yard Box */}
            <rect x="75" y="208" width="60" height="12" fill="none" stroke="#ffffffaa" strokeWidth="1.5" />
            {/* Bottom Penalty Arc */}
            <path d="M 85 185 A 20 20 0 0 1 125 185" fill="none" stroke="#ffffffaa" strokeWidth="1.5" />
          </g>

          {/* Stadium stands/sections */}
          {sections.map((sec) => {
            const { fill, stroke, pulse, duration, zone } = getZoneDensityColors(sec.id);
            return (
              <g
                key={sec.id}
                tabIndex={0}
                role="button"
                aria-label={`${sec.label} — click for details`}
                style={{ cursor: 'pointer', outline: 'none' }}
                onMouseEnter={() => setActiveTooltip(sec.id)}
                onMouseLeave={() => setActiveTooltip(null)}
                onFocus={() => setActiveTooltip(sec.id)}
                onBlur={() => setActiveTooltip(null)}
              >
                <polygon
                  points={sec.path.replace(/[MZ]/g, '').replace(/L/g, ' ')}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2"
                  filter={activeTooltip === sec.id ? 'url(#glow-strong)' : 'none'}
                  style={{ transition: 'all 0.3s ease' }}
                />
                
                {/* Density Pulsing Node */}
                <circle
                  cx={sec.cx}
                  cy={sec.cy}
                  r="6"
                  fill={pulse}
                  opacity="0.8"
                  style={{
                    animation: `pulse ${duration} infinite ease-in-out`,
                    transformOrigin: `${sec.cx}px ${sec.cy}px`
                  }}
                />
                
                {/* Stand Label */}
                <text
                  x={sec.cx}
                  y={sec.cy + 18}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontFamily="Inter, sans-serif"
                  fontWeight="600"
                  pointerEvents="none"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {sec.label}
                </text>
                
                {/* Density % */}
                {zone && (
                  <text
                    x={sec.cx}
                    y={sec.cy - 12}
                    textAnchor="middle"
                    fill={pulse}
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                    fontWeight="700"
                    pointerEvents="none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    {Math.round((zone.currentOccupancy / zone.capacity) * 100)}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Facility icons */}
          {facilityIcons.map((fi, i) => (
            <text
              key={i}
              x={fi.x}
              y={fi.y}
              textAnchor="middle"
              fontSize="14"
              aria-label={fi.label}
              role="img"
              style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
            >
              {fi.icon}
            </text>
          ))}
        </svg>
        
        {/* Modern Interactive Legend */}
        <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
          padding: '1rem',
          background: 'var(--color-bg-input)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-bg-glass)'
        }}>
          {Object.entries(DENSITY_COLORS).map(([density, colors]) => (
            <div key={density} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: colors.pulse,
                boxShadow: `0 0 8px ${colors.pulse}88`
              }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {density}
              </span>
            </div>
          ))}
        </div>
        
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.6); opacity: 0.2; }
            100% { transform: scale(1); opacity: 0.8; }
          }
        `}</style>
      </div>
    </div>
  );
};

import React from 'react';
import { StadiumZone, CrowdDensity } from '@/types';

interface StadiumMapProps {
  zones: readonly StadiumZone[];
}

const DENSITY_COLORS: Record<CrowdDensity, { fill: string; pulse: string }> = {
  [CrowdDensity.Low]: { fill: '#10B981', pulse: '#34D399' },
  [CrowdDensity.Moderate]: { fill: '#F59E0B', pulse: '#FCD34D' },
  [CrowdDensity.High]: { fill: '#EF4444', pulse: '#FC8181' },
  [CrowdDensity.Critical]: { fill: '#7C0000', pulse: '#EF4444' },
};

export const StadiumMap: React.FC<StadiumMapProps> = ({ zones }) => {
  const getZoneDensityColors = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return { fill: '#4F8EF722', stroke: '#4F8EF766', pulse: '#4F8EF7', duration: '3s' };
    
    const colors = DENSITY_COLORS[zone.density];
    const duration = zone.density === CrowdDensity.Critical ? '0.8s' : zone.density === CrowdDensity.High ? '1.5s' : '3s';
    
    return {
      fill: colors.fill + '44',
      stroke: colors.fill + 'bb',
      pulse: colors.pulse,
      duration,
    };
  };

  const sections = [
    { id: 'z-201', label: 'North Stand', path: 'M120,50 L280,50 L260,130 L140,130 Z', cx: 200, cy: 82 },
    { id: 'z-exit-b', label: 'South Stand', path: 'M140,270 L260,270 L280,350 L120,350 Z', cx: 200, cy: 316 },
    { id: 'z-101', label: 'East Wing', path: 'M270,120 L350,100 L350,300 L270,280 Z', cx: 316, cy: 200 },
    { id: 'z-rr1', label: 'West Wing', path: 'M130,120 L50,100 L50,300 L130,280 Z', cx: 84, cy: 200 },
    { id: 'z-vip', label: 'VIP Pavilion', path: 'M180,130 L220,130 L220,160 L180,160 Z', cx: 200, cy: 145 },
    { id: 'z-fc1', label: 'Upper North', path: 'M110,20 L290,20 L280,50 L120,50 Z', cx: 200, cy: 36 },
    { id: 'z-fc2', label: 'Upper South', path: 'M120,350 L280,350 L290,380 L110,380 Z', cx: 200, cy: 366 },
    { id: 'z-conc', label: 'Main Concourse', path: 'M35,35 L365,35 L365,365 L35,365 L35,35 M50,50 L350,50 L350,350 L50,350 Z', cx: 200, cy: 200, isRing: true }, // Outer ring approximation
  ];

  const facilityIcons = [
    { x: 155, y: 75, icon: '🍔', label: 'Food North' },
    { x: 320, y: 185, icon: '🍔', label: 'Food East' },
    { x: 70, y: 185, icon: '🍟', label: 'Food West' },
    { x: 170, y: 315, icon: '🚻', label: 'Restroom South' },
    { x: 310, y: 145, icon: '🚻', label: 'Restroom East' },
    { x: 70, y: 145, icon: '🚻', label: 'Restroom West' },
    { x: 355, y: 100, icon: '🚪', label: 'Gate B' },
    { x: 45, y: 100, icon: '🚪', label: 'Gate C' },
    { x: 200, y: 18, icon: '🚪', label: 'Gate A' },
    { x: 200, y: 382, icon: '🚪', label: 'Gate D' },
  ];

  return (
    <div className="stadium-heatmap" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 400 400"
        role="img"
        aria-label="Stadium crowd density heatmap"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="400" height="400" fill="#0A0E1A" rx="20" />

        {/* Field (center oval) */}
        <ellipse cx="200" cy="200" rx="90" ry="70" fill="url(#fieldGrad)" stroke="#ffffff33" strokeWidth="1" />
        <line x1="200" y1="140" x2="200" y2="260" stroke="#ffffff44" strokeWidth="1.5" />
        <text x="200" y="205" textAnchor="middle" fill="#ffffff88" fontSize="10" fontFamily="Inter, sans-serif">
          🏏 PITCH
        </text>

        {/* Stadium sections */}
        {sections.map((sec) => {
          const colors = getZoneDensityColors(sec.id);
          return (
            <g
              key={sec.id}
              tabIndex={0}
              role="button"
              aria-label={`${sec.label} — click for details`}
              style={{ cursor: 'pointer' }}
            >
              <polygon
                points={sec.path.replace(/[MZ]/g, '').replace(/L/g, ' ')}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="1.5"
                filter="url(#glow)"
                style={{ transition: 'fill 0.5s ease' }}
                fillRule={sec.isRing ? 'evenodd' : 'nonzero'}
              />
              {!sec.isRing && (
                <>
                  <circle
                    cx={sec.cx}
                    cy={sec.cy}
                    r="8"
                    fill={colors.pulse}
                    opacity="0.6"
                    style={{
                      animation: `pulse ${colors.duration} infinite`,
                      transformOrigin: `${sec.cx}px ${sec.cy}px`
                    }}
                  />
                  <text
                    x={sec.cx}
                    y={sec.cy + 4}
                    textAnchor="middle"
                    fill="#ffffffcc"
                    fontSize="7"
                    fontFamily="Inter, sans-serif"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {sec.label.toUpperCase()}
                  </text>
                </>
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
            fontSize="10"
            aria-label={fi.label}
            role="img"
          >
            {fi.icon}
          </text>
        ))}

        {/* Legend */}
        <g>
          <circle cx="16" cy="390" r="4" fill="#10B981" />
          <text x="24" y="394" fill="#94A3B8" fontSize="8" fontFamily="Inter, sans-serif">Low</text>
          
          <circle cx="76" cy="390" r="4" fill="#F59E0B" />
          <text x="84" y="394" fill="#94A3B8" fontSize="8" fontFamily="Inter, sans-serif">Moderate</text>
          
          <circle cx="136" cy="390" r="4" fill="#EF4444" />
          <text x="144" y="394" fill="#94A3B8" fontSize="8" fontFamily="Inter, sans-serif">High</text>

          <circle cx="196" cy="390" r="4" fill="#7C0000" />
          <text x="204" y="394" fill="#94A3B8" fontSize="8" fontFamily="Inter, sans-serif">Critical</text>
        </g>
      </svg>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0.2; }
          100% { transform: scale(0.95); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

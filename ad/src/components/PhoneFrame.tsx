import React from 'react';

// Minimal iPhone-shaped chrome to wrap each in-app mockup. Rounded
// corners + soft shadow gives the "screen inside a device" feel
// without us having to render a full hardware bezel. Notch is a
// simple top pill so the focus stays on what's IN the screen.
type Props = {
  children: React.ReactNode;
  width?: number;          // device width in px (composition units)
  scale?: number;          // optional scale factor for the wrap
};

export const PhoneFrame: React.FC<Props> = ({
  children, width = 480, scale = 1,
}) => {
  const height = Math.round(width * 2.165);    // iPhone aspect ~19.5:9
  const radius = Math.round(width * 0.10);

  return (
    <div
      style={{
        width, height,
        borderRadius: radius,
        background: '#000',
        padding: 8,
        boxShadow:
          '0 60px 120px -40px rgba(0,0,0,0.45), 0 10px 30px -10px rgba(0,0,0,0.30)',
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%', height: '100%',
          borderRadius: radius - 8,
          overflow: 'hidden',
          background: 'oklch(0.93 0.018 78)',
        }}
      >
        {/* Top safe-area pill */}
        <div
          style={{
            position: 'absolute', top: 14,
            left: '50%', transform: 'translateX(-50%)',
            width: 110, height: 28, borderRadius: 999,
            background: '#000',
            zIndex: 10,
          }}
        />
        {children}
      </div>
    </div>
  );
};

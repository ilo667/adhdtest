export function BrainIcon({ size = 22, white = false }: { size?: number; white?: boolean }) {
  const stroke = white ? "#60a5fa" : "#1066b9";
  const strokeSecondary = white ? "rgba(147,197,253,0.5)" : "#93c5fd";
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 3 C14 1 18 1 20 4 C23 7 23 12 21 15 C22 17 22 20 20 22 C18 24 15 24 14 22 C13 24 13 25 13 25" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M13 3 C12 1 8 1 6 4 C3 7 3 12 5 15 C4 17 4 20 6 22 C8 24 11 24 12 22 C13 24 13 25 13 25" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="13" y1="3" x2="13" y2="25" stroke={strokeSecondary} strokeWidth="1" strokeDasharray="3,2" opacity="0.6"/>
      <path d="M17 7 C19 9 19 12 18 14" stroke={strokeSecondary} strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <path d="M9 7 C7 9 7 12 8 14" stroke={strokeSecondary} strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

export function BrainsMateLogo({ size = 22, white = false }: { size?: number; white?: boolean }) {
  return (
    <div className="flex items-center gap-2 font-bold" style={{ fontSize: size * 0.85 }}>
      <BrainIcon size={size} white={white} />
      <span>
        <span style={{ color: white ? "#ffffff" : "#1a2340" }}>Brains</span>
        <span style={{ color: white ? "#60a5fa" : "#1066b9" }}>Mate</span>
      </span>
    </div>
  );
}

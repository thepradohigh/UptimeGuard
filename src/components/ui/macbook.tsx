import React from 'react';

export function MacBook({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* Top Bar / Screen Bezel */}
      <div className="relative bg-[#161616] rounded-t-2xl p-3 pt-4 border border-zinc-700/60 shadow-2xl">
        {/* Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#0A0A0A] rounded-b-md flex items-center justify-center z-20">
          <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/50" />
          </div>
        </div>
        {/* Display Inner */}
        <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-[#0A0A0A] aspect-[16/10]">
          {children}
        </div>
      </div>
      {/* Laptop Base */}
      <div className="relative bg-zinc-800 rounded-b-2xl h-4 w-[104%] -left-[2%] border-t border-zinc-700/50 shadow-xl flex justify-center">
        <div className="w-24 h-1.5 bg-zinc-700/60 rounded-b-sm" />
      </div>
    </div>
  );
}

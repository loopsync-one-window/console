"use client";

import { useState } from "react";

// Updated country data with India and Global options
const countryOptions = [
  { code: "in", name: "IN", flag: "/flags/india.svg", currency: { code: "INR", symbol: "₹" } },
  { code: "global", name: "GL", flag: "/flags/worldwide.svg", currency: { code: "USD", symbol: "$" } },
];

export default function CountryCurrencyDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(countryOptions[0]);

  return (
    <div className="relative select-none w-15">

      {/* Selected */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="
        w-full flex items-center justify-center gap-2
        px-1.5 py-2 rounded-full
        backdrop-blur-md bg-transparent border border-white/10 
        text-white text-[12px] font-semibold
        transition hover:bg-white/20 active:scale-[0.98]
        pointer-events-none
      "
      >
        <span className="flex items-center gap-1 leading-none text-white">
          {selected.flag.endsWith('.svg') ? (
            <img
              src={selected.flag}
              alt={`${selected.name} flag`}
              className="w-4 h-4 object-contain"
            />
          ) : (
            <span className="text-base">{selected.flag}</span>
          )}
          <span className="opacity-100 font-semibold">{selected.name}</span>
          {/* <span className="opacity-100">{selected.currency.code}</span>
        <span>({selected.currency.symbol})</span> */}
        </span>
      </button>
    </div>
  );
}
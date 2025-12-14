"use client";

import { Brain, Gauge, Database, Atom, Globe, Rocket, Layers, Settings, Network } from "lucide-react";

export default function ModelShowcase() {
  return (
    <div className="bg-transparent text-white py-20 px-6 rounded-3xl flex flex-col items-center relative">
      <div className="text-center mb-10 relative z-20">
        <h1 className="text-6xl font-bold">
          One Window<sup className="text-sm ml-2 align-super">TM</sup>
        </h1>

        <p className="text-white font-semibold text-2xl mt-4">
          A spectrum of models.
        </p>

        <p className="text-white text-2xl mt-6">
          “Choose a <span className="font-bold italic">faster</span> model when speed matters<br/>
          and a <span className="font-bold italic">smarter</span> one for more complex tasks.”
        </p>
      </div>
    </div>
  );
}

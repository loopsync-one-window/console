"use client";

import Image from "next/image";
import { CheckCheckIcon, Image as ImageIcon } from "lucide-react";

interface Model {
  model: string;
  speed: number;
  intelligence: number;
  context: string;
  imageProcessing: boolean;
}

interface Provider {
  name: string;
  logo: string;
}

interface ModelTableProps {
  models: Model[];
  providers: Provider[];
}

export default function ModelTable({ models, providers }: ModelTableProps) {
  return (
    <div className="w-full text-gray-300 mb-30">

      {/* PROVIDERS ROW */}
      {/* <div className="flex items-center justify-center gap-10 pb-6">
        {providers.map((p) => (
          <div key={p.name} className="flex flex-col items-center opacity-70 hover:opacity-100 transition">
            <Image src={p.logo} alt={p.name} width={28} height={28} className="rounded-full object-cover invert" />
            <span className="text-sm mt-2">{p.name}</span>
          </div>
        ))}
      </div> */}

      <div className="border-b border-white/10 mb-4"></div>

      {/* TABLE */}
      <div className="w-full">
        <div className="grid grid-cols-5 text-sm uppercase text-white font-bold pb-2 px-2">
          <span>model</span>
          <span>speed</span>
          <span>intelligence</span>
          <span className="text-center">image processing</span>
          <span className="text-right">context</span>
        </div>

        <div className="space-y-4">
          {models.map((m) => (
            <div
              key={m.model}
              className="grid grid-cols-5 items-center px-2 py-2 rounded-lg"
            >
              {/* MODEL NAME */}
              <span className="text-white font-bold">{m.model}</span>

              {/* SPEED BARS */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full w-6 ${
                      i < m.speed
                        ? "bg-red-400"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* INTELLIGENCE BARS */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full w-6 ${
                      i < m.intelligence
                        ? "bg-red-400"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* IMAGE PROCESSING */}
              <div className="flex justify-center">
                {m.imageProcessing ? (
                  <CheckCheckIcon className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-gray-500">---</span>
                )}
              </div>

              {/* CONTEXT */}
              <span className="text-right text-gray-200">{m.context}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
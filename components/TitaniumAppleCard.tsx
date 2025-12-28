"use client";
import React, { useRef, useEffect } from "react";

export default function TitaniumAppleCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Simple tilt animation
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / 20);
      const rotateY = x / 20;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const resetTilt = () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", resetTilt);

    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", resetTilt);
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div
        ref={cardRef}
        className="
          relative w-[350px] h-[210px] rounded-2xl 
          transition-transform duration-200 ease-out
          shadow-[0_10px_30px_rgba(0,0,0,0.3)]
          overflow-hidden
          flex flex-col justify-between
          p-5
          group
          bg-black
        "
        style={{
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Top section with Logo and Flag */}
        <div className="flex justify-between items-center">
          <div className="opacity-100">
            <img
              src="/resources/logo.svg"
              alt="LoopSync Logo"
              className="h-7 w-auto"
            />
          </div>

          {/* Indian Flag */}
          <div className="opacity-100">
            <img
              src="/flags/india.svg"
              alt="Indian Flag"
              className="h-5 w-auto"
            />
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex items-end justify-between w-full">
          {/* Cardholder Name */}
          <div className="flex items-center gap-2 text-gray-300 tracking-wide text-[14px] font-medium">
            <span>Powered by</span>
            <img
              src="/payment/razorpay.png"
              alt="Razorpay"
              className="h-4 w-auto brightness-0 invert relative -top-[-2px]"
            />
          </div>


          {/* Metal Chip */}
          <div
            className="
              w-12 h-8 rounded-md 
              bg-gradient-to-br from-[#3a3a3a] to-[#1d1d1d]
              border border-[#555]
              flex items-center justify-center
              relative overflow-hidden
            "
          >
            {/* Etched lines */}
            <div className="absolute inset-0 grid grid-cols-4 opacity-25">
              <div className="border-r border-neutral-500" />
              <div className="border-r border-neutral-500" />
              <div className="border-r border-neutral-500" />
              <div className="border-r border-neutral-500" />
            </div>

          </div>
        </div>

        {/* Shine overlay */}
        <div
          className="
            absolute inset-0 pointer-events-none 
            bg-gradient-to-br from-white/5 to-transparent
            opacity-0 group-hover:opacity-40
            transition-opacity duration-500
          "
        />
      </div>
    </div>
  );
}

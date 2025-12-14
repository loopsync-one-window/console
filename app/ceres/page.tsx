"use client";

export default function CeresPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <img
        src="/space/space.png"
        alt="Space Background"
        className="w-full h-full object-cover"
      />
      {/* Gradient overlay - darker on the left side */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.91) 0%, rgba(0, 0, 0, 0.64) 50%, rgba(0, 0, 0, 0.1) 100%)'
        }}
      />
    </div>
  );
}
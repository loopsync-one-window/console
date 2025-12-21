"use client";

import GradientBlinds from "@/components/GradientBlinds";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  // Define gradient colors for the 404 page (purple theme)
  const notFoundColors = [
    "#1a001a", // deep purple (base)
    "#3a0066", // dark purple
    "#6600cc", // bright purple
    "#8000ff", // vivid purple
    "#9933ff", // light purple highlight
    "#6600cc", // mid purple
  ];

  return (
    <div className="min-h-screen bg-[#07080a] text-white overflow-hidden">
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left Column - Content */}
        <div className="flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* 404 Error Text */}
            <div className="text-center mb-8">
              <h1 className="text-9xl font-bold tracking-tighter mb-2 bg-clip-text text-transparent bg-white animate-pulse">
                404
              </h1>
              <h2 className="text-3xl font-light tracking-tight mb-4 text-white">
                Page Not Found
              </h2>
              <p className="text-white/70 text-lg">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button
                onClick={() => router.back()}
                variant="default"
                className="bg-white text-black rounded-full px-6 py-3 font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Go Back
              </Button>

              <Button
                onClick={() => router.push('/')}
                variant="default"
                className="bg-white text-black rounded-full px-6 py-3 font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Home
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Animated Background */}
        <div className="relative h-screen overflow-hidden flex items-center justify-center bg-black">
          <GradientBlinds
            angle={45}
            gradientColors={notFoundColors}
            animateColors={true}
            transitionDuration={2000}
            startDelay={0.5}
          />


        </div>

      </div>
    </div>
  );
}
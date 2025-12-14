"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function MobileScreeningPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this email to your backend
    console.log("Email submitted:", email);
    
    setIsSubmitting(true);
    
    // Clear the input field
    setEmail("");
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        {/* Robot Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Robot body */}
            <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              {/* Robot face */}
              <div className="relative">
                {/* Eyes */}
                <div className="flex justify-center gap-4 mb-4">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                {/* Smile */}
                <div className="w-12 h-6 border-b-4 border-white rounded-b-full mx-auto"></div>
              </div>
            </div>
            {/* Robot antenna */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-white/30"></div>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold mb-4">Aww, We're Sad <br/>to See You Go!</h1>
        
        <p className="text-white/80 mb-8">
            Currently not supported on mobile. For the best experience, use a desktop. Enter your email, and we'll send setup instructions.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-white/50" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 bg-transparent backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-white/70 transition-colors"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Instructions Sent!" : "Send Instructions"}
          </button>
        </form>
      </div>
    </div>
  );
}
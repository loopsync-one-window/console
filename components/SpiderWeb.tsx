"use client";

import React, { useEffect, useRef } from 'react';

const SpiderWeb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Spider web parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
    const layers = 14;
    const strands = 14;
    
    // Animation variables
    let time = 0;
    let animationFrameId: number;
    
    // Spider state for dying animation
    let spiderState = {
      x: centerX,
      y: centerY * 0.7,
      rotation: 0,
      legMovement: 0,
      isDying: false,
      fallSpeed: 0,
      shakeIntensity: 0
    };

    // Draw spider web
    const drawWeb = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set styles
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.5;
      
      // Draw radial strands
      for (let i = 0; i < strands; i++) {
        const angle = (i / strands) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * maxRadius;
        const y = centerY + Math.sin(angle) * maxRadius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      
      // Draw concentric circles with slight animation
      for (let i = 1; i <= layers; i++) {
        const radius = (i / layers) * maxRadius;
        // Add subtle animation effect
        const animatedRadius = radius + Math.sin(time * 0.02 + i) * 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, animatedRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw connecting strands for a more realistic web
      for (let i = 0; i < strands; i++) {
        const angle1 = (i / strands) * Math.PI * 2;
        const angle2 = ((i + 1) % strands) / strands * Math.PI * 2;
        
        for (let j = 1; j < layers; j++) {
          const radius = (j / layers) * maxRadius;
          const x1 = centerX + Math.cos(angle1) * radius;
          const y1 = centerY + Math.sin(angle1) * radius;
          const x2 = centerX + Math.cos(angle2) * radius;
          const y2 = centerY + Math.sin(angle2) * radius;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
      
      // Add some random "dew drops" for realism
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const size = Math.random() * 2 + 1;
        
        // Animate dew drops subtly
        const animatedSize = size + Math.sin(time * 0.05 + i) * 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, animatedSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update spider state for dying animation
        if (time > 1080 && !spiderState.isDying) {
            spiderState.isDying = true;
            spiderState.shakeIntensity = 3;
            spiderState.fallSpeed = 0.5;
            }
      
      if (spiderState.isDying) {
        // Increase shaking intensity
        spiderState.shakeIntensity += 0.1;
        // Increase fall speed
        spiderState.fallSpeed += 0.05;
        // Move spider downward
        spiderState.y += spiderState.fallSpeed;
        // Add shaking effect
        spiderState.x += (Math.random() - 0.5) * spiderState.shakeIntensity;
        spiderState.rotation += (Math.random() - 0.5) * 0.2;
        // Increase leg movement
        spiderState.legMovement += 0.3;
      } else {
        // Normal movement before dying
        spiderState.x = centerX + Math.cos(time * 0.01) * (maxRadius * 0.7);
        spiderState.y = centerY + Math.sin(time * 0.01) * (maxRadius * 0.7);
        spiderState.legMovement = Math.sin(time * 0.1) * 0.5;
      }
      
      // Draw spider body (black)
      const spiderX = spiderState.x;
      const spiderY = spiderState.y;
      const spiderBodyRadius = 8;
      const rotation = spiderState.rotation;
      
      // Save context for rotation
      ctx.save();
      ctx.translate(spiderX, spiderY);
      ctx.rotate(rotation);
      
      // Spider body
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(0, 0, spiderBodyRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Spider legs with dying animation
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const legAngle = (i / 8) * Math.PI * 2 + spiderState.legMovement * Math.sin(time * 0.2 + i);
        const legLength = spiderBodyRadius * 2.5;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(legAngle) * legLength,
          Math.sin(legAngle) * legLength
        );
        ctx.stroke();
      }
      
      // Spider eyes (red)
      ctx.fillStyle = 'red';
      // Left eye
      ctx.beginPath();
      ctx.arc(
        -spiderBodyRadius * 0.3,
        -spiderBodyRadius * 0.2,
        spiderBodyRadius * 0.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Right eye
      ctx.beginPath();
      ctx.arc(
        spiderBodyRadius * 0.3,
        -spiderBodyRadius * 0.2,
        spiderBodyRadius * 0.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Restore context
      ctx.restore();
      
      // Update time for animation
      time++;
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(drawWeb);
    };
    
    // Start animation
    drawWeb();
    
    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawWeb();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};

export default SpiderWeb;
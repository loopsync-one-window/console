"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Renderer, Program, Mesh, Triangle } from "ogl"

export interface GradientBlindsProps {
  className?: string
  dpr?: number
  paused?: boolean
  gradientColors?: string[]
  angle?: number
  noise?: number
  blindCount?: number
  blindMinWidth?: number
  mouseDampening?: number
  mirrorGradient?: boolean
  spotlightRadius?: number
  spotlightSoftness?: number
  spotlightOpacity?: number
  distortAmount?: number
  shineDirection?: "left" | "right"
  mixBlendMode?: string
  animateColors?: boolean
  transitionDuration?: number
  startDelay?: number
}

const MAX_COLORS = 8
const hexToRGB = (hex: string): [number, number, number] => {
  const c = hex.replace("#", "").padEnd(6, "0")
  const r = Number.parseInt(c.slice(0, 2), 16) / 255
  const g = Number.parseInt(c.slice(2, 4), 16) / 255
  const b = Number.parseInt(c.slice(4, 6), 16) / 255
  return [r, g, b]
}
const prepStops = (stops?: string[]) => {
  const base = (stops && stops.length ? stops : ["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"]).slice(0, MAX_COLORS)
  if (base.length === 1) base.push(base[0])
  while (base.length < MAX_COLORS) base.push(base[base.length - 1])
  const arr: [number, number, number][] = []
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[i]))
  const count = Math.max(2, Math.min(MAX_COLORS, stops?.length ?? 2))
  return { arr, count }
}

const GradientBlinds: React.FC<GradientBlindsProps> = ({
  className,
  dpr,
  paused = false,
  gradientColors = ["#0f1629", "#1e3a8a", "#2563eb", "#1d4ed8"],
  angle = 0,
  noise = 0.3,
  blindCount = 16,
  blindMinWidth = 60,
  mouseDampening = 0.15,
  mirrorGradient = false,
  spotlightRadius = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 1,
  distortAmount = 0,
  shineDirection = "left",
  mixBlendMode = "lighten",
  animateColors = false,
  transitionDuration = 2000,
  startDelay = 2.5,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const programRef = useRef<Program | null>(null)
  const meshRef = useRef<Mesh<Triangle> | null>(null)
  const geometryRef = useRef<Triangle | null>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const mouseTargetRef = useRef<[number, number]>([0, 0])
  const lastTimeRef = useRef<number>(0)
  const firstResizeRef = useRef<boolean>(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({
      dpr: dpr ?? (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true,
    })
    rendererRef.current = renderer
    const gl = renderer.gl
    const canvas = gl.canvas as HTMLCanvasElement

    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    container.appendChild(canvas)

    const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

    const fragment = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;
uniform float uRevealProgress;

uniform float uAngle;
uniform float uNoise;
uniform float uBlindCount;
uniform float uSpotlightRadius;
uniform float uSpotlightSoftness;
uniform float uSpotlightOpacity;
uniform float uMirror;
uniform float uDistort;
uniform float uShineFlip;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;
uniform float uAnimateColors;
uniform float uTransitionDuration;
uniform float uStartDelay;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotate2D(vec2 p, float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c) * p;
}

vec3 getGradientColor(float t){
  float tt = clamp(t, 0.0, 1.0);
  int count = uColorCount;
  if (count < 2) count = 2;
  float scaled = tt * float(count - 1);
  float seg = floor(scaled);
  float f = fract(scaled);

  vec3 color;
  if (seg < 1.0) color = mix(uColor0, uColor1, f);
  else if (seg < 2.0 && count > 2) color = mix(uColor1, uColor2, f);
  else if (seg < 3.0 && count > 3) color = mix(uColor2, uColor3, f);
  else if (seg < 4.0 && count > 4) color = mix(uColor3, uColor4, f);
  else if (seg < 5.0 && count > 5) color = mix(uColor4, uColor5, f);
  else if (seg < 6.0 && count > 6) color = mix(uColor5, uColor6, f);
  else if (seg < 7.0 && count > 7) color = mix(uColor6, uColor7, f);
  else if (count > 7) color = uColor7;
  else if (count > 6) color = uColor6;
  else if (count > 5) color = uColor5;
  else if (count > 4) color = uColor4;
  else if (count > 3) color = uColor3;
  else if (count > 2) color = uColor2;
  else color = uColor1;

  // Color animation logic
  if (uAnimateColors > 0.5) {
    // Apply start delay
    float adjustedTime = max(0.0, iTime - uStartDelay);
    
    // Create a smooth looping animation with 1500ms cycle
    float cycleTime = uTransitionDuration * 2.0; // Total cycle time (forward and backward)
    float elapsed = mod(adjustedTime, cycleTime);
    
    // Progress from 0 to 1 and back to 0 for smooth looping
    float progress = (elapsed < uTransitionDuration) ? 
                     elapsed / uTransitionDuration : 
                     2.0 - elapsed / uTransitionDuration;
    
    // Create wave effect from center
    vec2 center = vec2(0.5, 0.5);
    float distFromCenter = distance(vUv, center);
    
    // Adjust progress based on distance from center for wave effect
    float waveEffect = sin(distFromCenter * 8.0 - adjustedTime * 1.5) * 0.5 + 0.5;
    progress = progress * (0.7 + 0.3 * waveEffect);
    
    // Clamp progress between 0 and 1
    progress = clamp(progress, 0.0, 1.0);
    // Blue-only animation: darker <-> lighter variations
    vec3 darkerBlue = color * vec3(0.6, 0.6, 0.9);
    vec3 lighterBlue = color + vec3(0.05, 0.1, 0.2);
    lighterBlue = clamp(lighterBlue, 0.0, 1.0);
    color = mix(darkerBlue, lighterBlue, progress);
  }

  return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv0 = fragCoord.xy / iResolution.xy;

    float aspect = iResolution.x / iResolution.y;
    vec2 p = uv0 * 2.0 - 1.0;
    p.x *= aspect;
    vec2 pr = rotate2D(p, uAngle);
    pr.x /= aspect;
    vec2 uv = pr * 0.5 + 0.5;

    vec2 uvMod = uv;
    if (uDistort > 0.0) {
      float a = uvMod.y * 6.0;
      float b = uvMod.x * 6.0;
      float w = 0.01 * uDistort;
      uvMod.x += sin(a) * w;
      uvMod.y += cos(b) * w;
    }
    float t = uvMod.x;
    if (uMirror > 0.5) {
      t = 1.0 - abs(1.0 - 2.0 * fract(t));
    }
    vec3 base = getGradientColor(t);

    float glowWave = sin(iTime * 0.8 + uv0.y * 3.14159) * 0.5 + 0.5;
    float glowPosition = sin(iTime * 0.3) * 0.5 + 0.5;
    float glowDistance = abs(uv0.y - glowPosition);
    float glowIntensity = 1.0 - smoothstep(0.0, 0.25, glowDistance);
    vec3 glowColor = base * (1.0 + glowIntensity * 0.01 * glowWave);

    vec2 offset = vec2(iMouse.x/iResolution.x, iMouse.y/iResolution.y);
    float d = length(uv0 - offset);
    float r = max(uSpotlightRadius, 1e-4);
    float dn = d / r;
    float spot = (1.0 - 2.0 * pow(dn, uSpotlightSoftness)) * uSpotlightOpacity;
    vec3 cir = vec3(spot);
    float stripe = fract(uvMod.x * max(uBlindCount, 1.0));
    if (uShineFlip > 0.5) stripe = 1.0 - stripe;
    vec3 ran = vec3(stripe);

    vec3 col = cir + glowColor - ran;
    col += (rand(gl_FragCoord.xy + iTime) - 0.5) * uNoise;

    fragColor = vec4(col, 1.0);
}

void main() {
    vec4 color;
    mainImage(color, vUv * iResolution.xy);
    gl_FragColor = color;
}
`

    const { arr: colorArr, count: colorCount } = prepStops(gradientColors)
    const uniforms: {
      iResolution: { value: [number, number, number] }
      iMouse: { value: [number, number] }
      iTime: { value: number }
      uRevealProgress: { value: number }
      uAngle: { value: number }
      uNoise: { value: number }
      uBlindCount: { value: number }
      uSpotlightRadius: { value: number }
      uSpotlightSoftness: { value: number }
      uSpotlightOpacity: { value: number }
      uMirror: { value: number }
      uDistort: { value: number }
      uShineFlip: { value: number }
      uColor0: { value: [number, number, number] }
      uColor1: { value: [number, number, number] }
      uColor2: { value: [number, number, number] }
      uColor3: { value: [number, number, number] }
      uColor4: { value: [number, number, number] }
      uColor5: { value: [number, number, number] }
      uColor6: { value: [number, number, number] }
      uColor7: { value: [number, number, number] }
      uColorCount: { value: number }
      uAnimateColors: { value: number }
      uTransitionDuration: { value: number }
      uStartDelay: { value: number }
    } = {
      iResolution: {
        value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1],
      },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uRevealProgress: { value: 1.0 },
      uAngle: { value: (angle * Math.PI) / 180 },
      uNoise: { value: noise },
      uBlindCount: { value: Math.max(1, blindCount) },
      uSpotlightRadius: { value: spotlightRadius },
      uSpotlightSoftness: { value: spotlightSoftness },
      uSpotlightOpacity: { value: spotlightOpacity },
      uMirror: { value: mirrorGradient ? 1 : 0 },
      uDistort: { value: distortAmount },
      uShineFlip: { value: shineDirection === "right" ? 1 : 0 },
      uColor0: { value: colorArr[0] },
      uColor1: { value: colorArr[1] },
      uColor2: { value: colorArr[2] },
      uColor3: { value: colorArr[3] },
      uColor4: { value: colorArr[4] },
      uColor5: { value: colorArr[5] },
      uColor6: { value: colorArr[6] },
      uColor7: { value: colorArr[7] },
      uColorCount: { value: colorCount },
      uAnimateColors: { value: animateColors ? 1 : 0 },
      uTransitionDuration: { value: transitionDuration / 1000 }, // Convert ms to seconds
      uStartDelay: { value: startDelay }, // Delay in seconds
    }

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms,
    })
    programRef.current = program

    const geometry = new Triangle(gl)
    geometryRef.current = geometry
    const mesh = new Mesh(gl, { geometry, program })
    meshRef.current = mesh

    const resize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1]

      if (blindMinWidth && blindMinWidth > 0) {
        const maxByMinWidth = Math.max(1, Math.floor(rect.width / blindMinWidth))

        const effective = blindCount ? Math.min(blindCount, maxByMinWidth) : maxByMinWidth
        uniforms.uBlindCount.value = Math.max(1, effective)
      } else {
        uniforms.uBlindCount.value = Math.max(1, blindCount)
      }

      const cx = gl.drawingBufferWidth / 2
      const cy = gl.drawingBufferHeight / 2
      uniforms.iMouse.value = [cx, cy]
      mouseTargetRef.current = [cx, cy]
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop)
      uniforms.iTime.value = t * 0.001

      lastTimeRef.current = t

      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current })
        } catch (e) {
          console.error(e)
        }
      }
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()

      const callIfFn = <T extends object, K extends keyof T>(obj: T | null, key: K) => {
        if (obj && typeof obj[key] === "function") {
          ;(obj[key] as unknown as () => void).call(obj)
        }
      }
      callIfFn(programRef.current, "remove")
      callIfFn(geometryRef.current, "remove")
      callIfFn(meshRef.current as unknown as { remove?: () => void }, "remove")
      callIfFn(rendererRef.current as unknown as { destroy?: () => void }, "destroy")
      programRef.current = null
      geometryRef.current = null
      meshRef.current = null
      rendererRef.current = null
    }
  }, [
    dpr,
    paused,
    gradientColors,
    angle,
    noise,
    blindCount,
    blindMinWidth,
    mouseDampening,
    mirrorGradient,
    spotlightRadius,
    spotlightSoftness,
    spotlightOpacity,
    distortAmount,
    shineDirection,
  ])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden relative ${className}`}
      style={{
        ...(mixBlendMode && {
          mixBlendMode: mixBlendMode as React.CSSProperties["mixBlendMode"],
        }),
      }}
    />
  )
}

export default GradientBlinds

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

export const useConfettiSound = (enabled: boolean = true) => {
  const hasPlayed = useRef(false)

  useEffect(() => {
    if (!enabled || hasPlayed.current) return

    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
      shapes: ['circle', 'square'],
      zIndex: 10000,
    })

    hasPlayed.current = true
  }, [enabled])
}

import React, { useState, useRef, useEffect } from "react";
import { Music, Music4Icon, Pause, Plane, Play } from "lucide-react";
import "./CeresButton.css";

interface CeresButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

const CeresButton: React.FC<CeresButtonProps> = ({ onClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (e) {
      console.error("Audio play failed:", e);
    }

    onClick?.();
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="btn-wrapper">
      <button
        className={`btn ${isPlaying ? "playing" : ""}`}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="btn-svg" strokeWidth={1} />
        ) : (
          <Plane className="btn-svg" strokeWidth={1} />
        )}

        <div className="txt-wrapper">
          <div className="txt-1">
            {"Start Theme".split("").map((c, i) => (
              <span key={i} className={`btn-letter ${c === " " ? "space" : ""}`}>
                {c}
              </span>
            ))}
          </div>
          <div className="txt-2">
            {"Start Theme".split("").map((c, i) => (
              <span key={i} className={`btn-letter ${c === " " ? "space" : ""}`}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </button>

      {/* REAL audio element */}
      <audio
        ref={audioRef}
        src="/music/loopsync-theme-song.mp3"
        loop
        preload="auto"
      />
    </div>
  );
};

export default CeresButton;

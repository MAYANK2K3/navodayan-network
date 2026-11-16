"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { sound } from "@/lib/sound";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playPop: () => void;
  playTap: () => void;
  playSuccess: () => void;
  playWhoosh: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  toggleMute: () => {},
  playPop: () => {},
  playTap: () => {},
  playSuccess: () => {},
  playWhoosh: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const toggleMute = () => {
    const nextState = sound.toggleMute();
    setIsMuted(nextState);
    if (!nextState) {
      sound.playPop();
    }
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playPop: () => sound.playPop(),
        playTap: () => sound.playTap(),
        playSuccess: () => sound.playSuccess(),
        playWhoosh: () => sound.playWhoosh(),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundFX() {
  return useContext(SoundContext);
}

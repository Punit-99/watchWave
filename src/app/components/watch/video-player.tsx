"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Tv,
  Gauge,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSaveProgress, useDeleteProgress } from "@/hooks/use-progress";

interface VideoPlayerProps {
  src: string;
  title?: string;
  onEnded?: () => void;
  // Progress tracking props:
  contentId?: string;
  contentType?: "MOVIE" | "SERIES";
  image?: string;
  description?: string;
  episodeId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  episodeTitle?: string;
  startTime?: number;
}

export function VideoPlayer({
  src,
  title,
  onEnded,
  contentId,
  contentType,
  image,
  description,
  episodeId,
  episodeNumber,
  seasonNumber,
  episodeTitle,
  startTime,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const saveProgressMutation = useSaveProgress();
  const deleteProgressMutation = useDeleteProgress();

  const saveCurrentProgress = () => {
    const video = videoRef.current;
    if (!video || !contentId || !contentType || video.duration === 0) return;

    saveProgressMutation.mutate({
      contentId,
      episodeId: episodeId || undefined,
      watchedTime: Math.floor(video.currentTime),
      duration: Math.floor(video.duration),
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    saveCurrentProgress();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (contentId) {
      deleteProgressMutation.mutate(contentId);
    }
    if (onEnded) onEnded();
  };

  // Periodic progress saving during playback
  useEffect(() => {
    if (!contentId || !contentType || !isPlaying) return;

    const saveInterval = setInterval(() => {
      saveCurrentProgress();
    }, 5000); // Save progress every 5 seconds

    return () => {
      clearInterval(saveInterval);
    };
  }, [contentId, contentType, isPlaying, title, image, description, episodeId, episodeNumber, seasonNumber, episodeTitle]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      saveCurrentProgress();
    };
  }, [contentId, contentType, title, image, description, episodeId, episodeNumber, seasonNumber, episodeTitle]);

  // Auto-hide controls timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timer);
      if (isPlaying && !showSpeedMenu) {
        timer = setTimeout(() => {
          setShowControls(false);
        }, 2500);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", () => {
        if (isPlaying) setShowControls(false);
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(timer);
    };
  }, [isPlaying, showSpeedMenu]);

  // Keep controls visible when paused
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
    }
  }, [isPlaying]);


  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Playback failed: ", err);
      });
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setIsLoading(false);
    if (startTime && startTime > 0 && startTime < video.duration) {
      video.currentTime = startTime;
      setCurrentTime(startTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
    video.muted = val === 0;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const muted = !isMuted;
    video.muted = muted;
    setIsMuted(muted);
    if (!muted && volume === 0) {
      video.volume = 0.5;
      setVolume(0.5);
    }
  };

  const adjustVolume = (amount: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = Math.max(0, Math.min(1, video.volume + amount));
    video.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
    video.muted = newVol === 0;
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Fullscreen failed: ", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const togglePIP = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      video.requestPictureInPicture().catch((err) => {
        console.error("PIP failed: ", err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const hrs = Math.floor(timeInSeconds / 3600);
    const mins = Math.floor((timeInSeconds % 3600) / 60);
    const secs = Math.floor(timeInSeconds % 60);

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Icon for volume level
  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };


  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          skip(-10);
          break;
        case "arrowright":
          e.preventDefault();
          skip(10);
          break;
        case "arrowup":
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, isMuted, volume]);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full h-full items-center justify-center overflow-hidden bg-black group"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={handlePause}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onEnded={handleEnded}
        onClick={togglePlay}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      )}

      {/* Control Overlays */}
      <div
        className={`absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/10 to-black/60 p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Now Playing
            </span>
            <span className="text-sm font-semibold text-white drop-shadow-md">
              {title || "WatchWave Player"}
            </span>
          </div>
        </div>

        {/* Big Center Play/Pause Indicator (Mobile/Click Helper) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          onClick={togglePlay}
        >
          {showControls && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition shadow-lg"
            >
              {isPlaying ? (
                <Pause className="h-7 w-7 fill-current" />
              ) : (
                <Play className="h-7 w-7 fill-current translate-x-0.5" />
              )}
            </button>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="space-y-3">
          {/* Progress / Seek bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-300 select-none">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-lg bg-zinc-700/50 appearance-none cursor-pointer accent-primary focus:outline-none transition-all hover:h-2"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(currentTime / (duration || 1)) * 100
                  }%, rgba(82, 82, 91, 0.4) ${(currentTime / (duration || 1)) * 100}%, rgba(82, 82, 91, 0.4) 100%)`,
              }}
            />
            <span className="text-xs font-medium text-zinc-300 select-none">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls Tray */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(-10)}
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
                title="Rewind 10s"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(10)}
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
                title="Forward 10s"
              >
                <RotateCw className="h-5 w-5" />
              </Button>

              {/* Volume Controller */}
              <div className="flex items-center gap-2 group/volume ml-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:text-primary hover:bg-white/10 rounded-full"
                >
                  <VolumeIcon />
                </Button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 h-1 rounded bg-zinc-700 appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(isMuted ? 0 : volume) * 100
                      }%, rgba(82, 82, 91, 0.4) ${(isMuted ? 0 : volume) * 100}%, rgba(82, 82, 91, 0.4) 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Playback Speed Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeedMenu(!showSpeedMenu);
                  }}
                  className="h-8 text-white hover:text-primary hover:bg-white/10 gap-1 rounded-full text-xs font-semibold px-3"
                >
                  <Gauge className="h-4 w-4" />
                  {playbackSpeed}x
                </Button>

                {showSpeedMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSpeedMenu(false);
                      }}
                    />
                    <div className="absolute right-0 bottom-full mb-2 z-30 bg-black/95 border border-white/10 rounded-xl p-1.5 min-w-[100px] shadow-2xl backdrop-blur-md">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeedChange(speed);
                            setShowSpeedMenu(false);
                          }}
                          className={`w-full text-left text-xs px-3 py-1.5 rounded-md hover:bg-white/10 transition cursor-pointer ${playbackSpeed === speed ? "text-primary font-bold" : "text-zinc-300"
                            }`}
                        >
                          {speed === 1 ? "Normal" : `${speed}x`}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={togglePIP}
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
                title="Picture-in-Picture"
              >
                <Tv className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { fetchAudioForPage } from '../lib/api';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from './ui/Button';

interface AudioPlayerProps {
  page: number;
  reciterId: number;
  onReciterChange: (id: number) => void;
  reciters: any[];
}

export function AudioPlayer({ page, reciterId, onReciterChange, reciters }: AudioPlayerProps) {
  const [audioFiles, setAudioFiles] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (page > 0) {
      fetchAudioForPage(reciterId, page).then(setAudioFiles).catch(console.error);
    }
  }, [page, reciterId]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [page, reciterId]);

  const playNext = () => {
    if (currentIndex + 1 < audioFiles.length) {
      setCurrentIndex(currentIndex + 1);
      if (audioRef.current) {
        audioRef.current.src = audioFiles[currentIndex + 1].url;
        audioRef.current.play();
      }
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioFiles.length) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioFiles[currentIndex].url);
        audioRef.current.addEventListener('ended', playNext);
        audioRef.current.addEventListener('timeupdate', () => {
          if (audioRef.current) {
            setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100);
          }
        });
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur">
      <div className="h-1 bg-secondary w-full">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between px-4 py-2 gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <select
            value={reciterId}
            onChange={(e) => onReciterChange(Number(e.target.value))}
            className="text-xs font-cairo h-8 rounded-md border border-input bg-background px-2"
          >
            {reciters.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          disabled={!audioFiles.length}
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
        </Button>
        <div className="flex-1 min-w-0 text-left">
          {audioFiles[currentIndex] && (
            <span className="text-xs text-muted-foreground font-cairo">
              الآية {audioFiles[currentIndex].verse_key}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

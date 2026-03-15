import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { QuranPage } from '../components/QuranPage';
import { AudioPlayer } from '../components/AudioPlayer';
import { IndexModal } from '../components/IndexModal';
import { TafsirModal } from '../components/TafsirModal';
import { AiModal } from '../components/AiModal';
import { useAuth } from '../hooks/useAuth';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { RECITERS } from '../lib/quran';

export function Home() {
  const { user } = useAuth();
  const { progress, savePage } = useReadingProgress();
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem('quran-last-page');
    return saved ? parseInt(saved) : 1;
  });
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [selectedVerseKey, setSelectedVerseKey] = useState<string | null>(null);
  const [selectedVerseText, setSelectedVerseText] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('quran-dark-mode') === 'true');
  const [reciterId, setReciterId] = useState(() => {
    const saved = localStorage.getItem('quran-reciter');
    return saved ? parseInt(saved) : 7;
  });

  useEffect(() => {
    if (user && progress?.lastPage && progress.lastPage !== page) {
      setPage(progress.lastPage);
    }
  }, [user, progress?.lastPage]);

  useEffect(() => {
    localStorage.setItem('quran-last-page', String(page));
    if (user) savePage(page);
  }, [page, user]);

  useEffect(() => {
    localStorage.setItem('quran-dark-mode', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('quran-reciter', String(reciterId));
  }, [reciterId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setPage(p => Math.max(1, p - 1));
      if (e.key === 'ArrowLeft') setPage(p => Math.min(604, p + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleVerseClick = (verseKey: string, verseText: string, action: 'tafsir' | 'ai') => {
    setSelectedVerseKey(verseKey);
    setSelectedVerseText(verseText);
    if (action === 'tafsir') {
      setIsTafsirOpen(true);
    } else {
      setIsAiOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background islamic-pattern">
      <Header
        currentPage={page}
        onOpenIndex={() => setIsIndexOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenTafsir={() => setIsTafsirOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
      />

      <main className="flex-1 flex flex-col py-4 pb-20">
        <QuranPage
          page={page}
          onPageChange={setPage}
          onVerseClick={handleVerseClick}
        />
      </main>

      <AudioPlayer
        page={page}
        reciterId={reciterId}
        onReciterChange={setReciterId}
        reciters={RECITERS}
      />

      <IndexModal
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onNavigate={setPage}
        currentPage={page}
      />

      <TafsirModal
        isOpen={isTafsirOpen}
        onClose={() => setIsTafsirOpen(false)}
        verseKey={selectedVerseKey}
      />

      <AiModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        verseKey={selectedVerseKey}
        verseText={selectedVerseText}
      />
    </div>
  );
}

import React from 'react';
import { getSurahForPage, getJuzForPage, QURAN_PAGES } from '../lib/quran';
import { useAuth } from '../hooks/useAuth';
import { useBookmarks } from '../hooks/useBookmarks';
import { Button } from './ui/Button';
import { BookOpen, List, Moon, Sun, Sparkles, LogOut, User, Bookmark, BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface HeaderProps {
  currentPage: number;
  onOpenIndex: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenTafsir: () => void;
  onOpenAi: () => void;
}

export function Header({ currentPage, onOpenIndex, darkMode, onToggleDarkMode, onOpenTafsir, onOpenAi }: HeaderProps) {
  const surah = getSurahForPage(currentPage);
  const juz = getJuzForPage(currentPage);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const handleBookmark = () => {
    if (!user) {
      toast.error('سجل دخولك أولاً', { description: 'تحتاج لتسجيل الدخول لحفظ العلامات المرجعية' });
      return;
    }
    toggleBookmark(currentPage);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" onClick={onOpenIndex} className="text-foreground hover:bg-accent/20 h-9 w-9">
            <List className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onOpenTafsir} className="text-foreground hover:bg-accent/20 h-9 w-9">
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onOpenAi} className="text-foreground hover:bg-accent/20 h-9 w-9">
            <Sparkles className="h-4 w-4 text-accent" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleBookmark} className="text-foreground hover:bg-accent/20 h-9 w-9">
            {isBookmarked(currentPage) ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-foreground font-cairo">سورة {surah.name}</span>
          <span className="text-xs text-muted-foreground font-cairo">
            الجزء {juz.number} • صفحة {currentPage} / {QURAN_PAGES}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" onClick={onToggleDarkMode} className="text-foreground hover:bg-accent/20 h-9 w-9">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {user ? (
            <Button variant="ghost" size="icon" onClick={signOut} className="text-foreground hover:bg-accent/20 h-9 w-9">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => navigate('/auth')} className="text-foreground hover:bg-accent/20 h-9 w-9">
              <User className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

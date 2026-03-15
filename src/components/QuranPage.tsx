import React, { useState, useEffect } from 'react';
import { getPageImageUrl, QURAN_PAGES } from '../lib/quran';
import { fetchVersesForPage } from '../lib/api';
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface QuranPageProps {
  page: number;
  onPageChange: (page: number) => void;
  onVerseClick: (verseKey: string, verseText: string, action: 'tafsir' | 'ai') => void;
}

export function QuranPage({ page, onPageChange, onVerseClick }: QuranPageProps) {
  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<any[]>([]);
  const [showVerses, setShowVerses] = useState(false);

  useEffect(() => {
    setLoading(true);
    setShowVerses(false);
    fetchVersesForPage(page)
      .then(setVerses)
      .catch(console.error);
  }, [page]);

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x < -50) {
      if (page < QURAN_PAGES) onPageChange(page + 1);
    } else if (info.offset.x > 50) {
      if (page > 1) onPageChange(page - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 })
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 relative select-none">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-12 w-10 rounded-full bg-card/80 text-foreground shadow-md hover:bg-accent/20 disabled:opacity-30"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= QURAN_PAGES}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-12 w-10 rounded-full bg-card/80 text-foreground shadow-md hover:bg-accent/20 disabled:opacity-30"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-lg mx-auto overflow-hidden px-4">
        <AnimatePresence mode="wait" custom={page}>
          <motion.div
            key={page}
            custom={page}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-accent/40 bg-card">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-card min-h-[500px]">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <span className="text-sm text-muted-foreground font-cairo">جارٍ تحميل الصفحة...</span>
                  </div>
                </div>
              )}
              <img
                src={getPageImageUrl(page)}
                alt={`صفحة ${page} من المصحف الشريف`}
                className={`w-full h-auto ${showVerses ? 'opacity-20' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
                draggable={false}
              />

              {showVerses && (
                <div className="absolute inset-0 overflow-y-auto p-4 bg-card/90 backdrop-blur-sm">
                  <div className="space-y-4 text-right" dir="rtl">
                    <h3 className="font-cairo font-bold text-lg text-center mb-4">اختر آية</h3>
                    {verses.map((v) => (
                      <div
                        key={v.id}
                        className="w-full text-right p-4 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors border border-border hover:border-accent/30"
                      >
                        <span className="font-amiri text-xl leading-loose block mb-4">{v.text} <span className="text-accent text-sm">({v.verse_key})</span></span>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onVerseClick(v.verse_key, v.text, 'tafsir')}
                            className="font-cairo text-xs"
                          >
                            تفسير
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onVerseClick(v.verse_key, v.text, 'ai')}
                            className="font-cairo text-xs gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            الذكاء الاصطناعي
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="text-xs font-cairo">
          السابقة
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowVerses(!showVerses)}
          className="text-xs font-cairo"
        >
          {showVerses ? 'إخفاء الآيات' : 'تحديد آية'}
        </Button>
        <span className="text-sm font-semibold text-foreground font-cairo tabular-nums">
          {page} / {QURAN_PAGES}
        </span>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= QURAN_PAGES} className="text-xs font-cairo">
          التالية
        </Button>
      </div>
    </div>
  );
}

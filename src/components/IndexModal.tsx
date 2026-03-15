import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { SURAHS, JUZS, QURAN_PAGES } from '../lib/quran';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Search, BookOpen, Layers } from 'lucide-react';

interface IndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: number) => void;
  currentPage: number;
}

export function IndexModal({ isOpen, onClose, onNavigate, currentPage }: IndexModalProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'surahs' | 'juz' | 'pages'>('surahs');

  const filteredSurahs = SURAHS.filter(s => s.name.includes(search) || String(s.number).includes(search));

  const handleNavigate = (page: number) => {
    onNavigate(page);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="فهرس القرآن الكريم">
      <div className="flex flex-col h-full">
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن سورة..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pr-9 text-right font-cairo"
          />
        </div>

        <div className="flex gap-2 mb-4 bg-muted p-1 rounded-lg">
          <Button
            variant={tab === 'surahs' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTab('surahs')}
            className="flex-1 gap-1 font-cairo text-xs"
          >
            <BookOpen className="h-3.5 w-3.5" />
            السور
          </Button>
          <Button
            variant={tab === 'juz' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTab('juz')}
            className="flex-1 gap-1 font-cairo text-xs"
          >
            <Layers className="h-3.5 w-3.5" />
            الأجزاء
          </Button>
          <Button
            variant={tab === 'pages' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTab('pages')}
            className="flex-1 gap-1 font-cairo text-xs"
          >
            الصفحات
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'surahs' && (
            <div className="space-y-1">
              {filteredSurahs.map(s => (
                <button
                  key={s.number}
                  onClick={() => handleNavigate(s.startPage)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-right hover:bg-accent/10 ${
                    currentPage >= s.startPage && (s.number === 114 || currentPage < SURAHS[s.number].startPage)
                      ? 'bg-accent/15 border border-accent/30'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary text-sm font-bold font-cairo shrink-0">
                    {s.number}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-bold text-foreground font-cairo">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-cairo">
                      {s.type} • {s.versesCount} آية • ص {s.startPage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {tab === 'juz' && (
            <div className="space-y-1">
              {JUZS.map(j => (
                <button
                  key={j.number}
                  onClick={() => handleNavigate(j.startPage)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-right hover:bg-accent/10"
                >
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-secondary/50 text-secondary-foreground text-sm font-bold font-cairo shrink-0">
                    {j.number}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-bold text-foreground font-cairo">الجزء {j.number}</p>
                    <p className="text-xs text-muted-foreground font-cairo">{j.name} • ص {j.startPage}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {tab === 'pages' && (
            <div className="p-3">
              <div className="mb-3">
                <label className="text-sm text-muted-foreground font-cairo block mb-1">
                  انتقل إلى صفحة (1 - {QURAN_PAGES})
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={QURAN_PAGES}
                    placeholder="رقم الصفحة"
                    className="text-center font-cairo"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = parseInt(e.currentTarget.value);
                        if (val >= 1 && val <= QURAN_PAGES) handleNavigate(val);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="font-cairo"
                    onClick={e => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const val = parseInt(input.value);
                      if (val >= 1 && val <= QURAN_PAGES) handleNavigate(val);
                    }}
                  >
                    اذهب
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: 30 }, (_, i) => {
                  const p = (i + 1) * 20;
                  return p <= QURAN_PAGES ? (
                    <button
                      key={p}
                      onClick={() => handleNavigate(p)}
                      className="p-2 text-xs font-cairo rounded-md bg-muted hover:bg-accent/20 text-foreground transition-colors"
                    >
                      {p}
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

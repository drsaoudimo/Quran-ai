import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { fetchTafsirForVerse } from '../lib/api';
import { TAFSIRS } from '../lib/quran';
import { Loader2 } from 'lucide-react';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseKey: string | null;
}

export function TafsirModal({ isOpen, onClose, verseKey }: TafsirModalProps) {
  const [tafsirId, setTafsirId] = useState(TAFSIRS[0].id);
  const [tafsir, setTafsir] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && verseKey) {
      setLoading(true);
      fetchTafsirForVerse(tafsirId, verseKey)
        .then(setTafsir)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, verseKey, tafsirId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={verseKey ? `تفسير الآية ${verseKey}` : 'اختر آية لعرض التفسير'}>
      <div className="flex flex-col h-full">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b">
          {TAFSIRS.map(t => (
            <button
              key={t.id}
              onClick={() => setTafsirId(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-cairo whitespace-nowrap transition-colors ${
                tafsirId === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent/20'
              }`}
            >
              {t.name.replace('تفسير ', '')}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : tafsir?.text ? (
            <div
              className="text-sm leading-8 font-amiri text-foreground"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: tafsir.text }}
            />
          ) : (
            <p className="text-center text-muted-foreground mt-8 font-cairo">لا يوجد تفسير متاح لهذه الآية</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

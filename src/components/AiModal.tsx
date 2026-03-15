import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { analyzeVerse } from '../lib/ai';
import { Sparkles, BookOpen, Scale, Languages, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseKey: string | null;
  verseText: string | null;
}

const MODES = [
  { id: 'explanation', label: 'شرح مبسط', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'asbab', label: 'أسباب النزول', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'tajweed', label: 'أحكام التجويد', icon: <Scale className="h-4 w-4" /> },
  { id: 'irab', label: 'الإعراب', icon: <Languages className="h-4 w-4" /> }
];

export function AiModal({ isOpen, onClose, verseKey, verseText }: AiModalProps) {
  const [mode, setMode] = useState('explanation');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (selectedMode: string) => {
    if (!verseKey || !verseText) return;
    setMode(selectedMode);
    setLoading(true);
    setResponse('');
    try {
      const res = await analyzeVerse(verseKey, verseText, selectedMode);
      setResponse(res);
    } catch (error: any) {
      if (error?.status === 429) {
        setResponse('⚠️ تم تجاوز حد الطلبات. يرجى المحاولة بعد قليل.');
      } else if (error?.status === 402) {
        setResponse('⚠️ يرجى إضافة رصيد للاستمرار في استخدام مساعد الذكاء الاصطناعي.');
      } else {
        setResponse('حدث خطأ في الاتصال بالمساعد الذكي. يرجى المحاولة لاحقاً.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="مساعد الذكاء الاصطناعي">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-accent" />
          <p className="text-xs text-muted-foreground text-center font-cairo">
            الآية {verseKey}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b">
          {MODES.map(m => (
            <Button
              key={m.id}
              variant={mode === m.id && response ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAnalyze(m.id)}
              disabled={!verseKey || loading}
              className="font-cairo text-xs gap-1.5 whitespace-nowrap flex-shrink-0"
            >
              {m.icon}
              {m.label}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : response ? (
            <div className="mt-4 space-y-3">
              <div className="text-sm leading-8 font-amiri text-foreground whitespace-pre-wrap" dir="rtl">
                {response}
              </div>
              <div className="bg-muted/50 rounded-lg p-3 mt-4">
                <p className="text-xs text-muted-foreground font-cairo text-center">
                  ⚠️ هذا المحتوى مُولَّد بالذكاء الاصطناعي وهو مساعد فقط وليس مرجعاً أساسياً. يرجى الرجوع للتفاسير المعتمدة للتأكد.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Sparkles className="h-8 w-8 mb-3 text-accent/50" />
              <p className="text-sm font-cairo">
                {verseKey ? 'اختر نوع التحليل أعلاه' : 'اختر آية لبدء التحليل'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

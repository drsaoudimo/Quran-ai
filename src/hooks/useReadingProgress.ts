import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from './useAuth';

export interface ReadingProgress {
  id: string;
  userId: string;
  lastPage: number;
  khatmaCount: number;
  updatedAt: string;
}

export function useReadingProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'reading_progress'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setProgress({ id: doc.id, ...doc.data() } as ReadingProgress);
      } else {
        setProgress(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching reading progress:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const savePage = async (page: number) => {
    if (!user) return;

    if (progress) {
      const newKhatmaCount = (page === 604 && progress.lastPage !== 604) ? progress.khatmaCount + 1 : progress.khatmaCount;
      await updateDoc(doc(db, 'reading_progress', progress.id), {
        lastPage: page,
        khatmaCount: newKhatmaCount,
        updatedAt: new Date().toISOString()
      });
    } else {
      await addDoc(collection(db, 'reading_progress'), {
        userId: user.uid,
        lastPage: page,
        khatmaCount: 0,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return { progress, loading, savePage };
}

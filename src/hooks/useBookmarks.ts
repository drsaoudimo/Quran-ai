import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from './useAuth';

export interface Bookmark {
  id: string;
  userId: string;
  page: number;
  createdAt: string;
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'bookmarks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bookmark));
      setBookmarks(bks);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching bookmarks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleBookmark = async (page: number) => {
    if (!user) throw new Error('Not authenticated');

    const existing = bookmarks.find(b => b.page === page);
    if (existing) {
      await deleteDoc(doc(db, 'bookmarks', existing.id));
    } else {
      await addDoc(collection(db, 'bookmarks'), {
        userId: user.uid,
        page,
        createdAt: new Date().toISOString()
      });
    }
  };

  const isBookmarked = (page: number) => bookmarks.some(b => b.page === page);

  return { bookmarks, loading, toggleBookmark, isBookmarked };
}

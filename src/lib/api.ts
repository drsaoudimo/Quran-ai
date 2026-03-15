const API_BASE = 'https://api.quran.com/api/v4';

export async function fetchAudioForPage(reciterId: number, page: number) {
  const res = await fetch(`${API_BASE}/recitations/${reciterId}/by_page/${page}`);
  if (!res.ok) throw new Error('Failed to fetch audio');
  const data = await res.json();
  return data.audio_files.map((file: any) => ({
    url: `https://verses.quran.com/${file.url}`,
    verse_key: file.verse_key
  }));
}

export async function fetchTafsirForVerse(tafsirId: number, verseKey: string) {
  const res = await fetch(`${API_BASE}/tafsirs/${tafsirId}/by_ayah/${verseKey}`);
  if (!res.ok) throw new Error('Failed to fetch tafsir');
  const data = await res.json();
  return {
    text: data.tafsir?.text || '',
    verse_key: verseKey,
    resource_name: data.tafsir?.resource_name || ''
  };
}

export async function fetchVersesForPage(page: number) {
  const res = await fetch(`${API_BASE}/verses/by_page/${page}?language=ar&words=false&translations=false&fields=text_uthmani`);
  if (!res.ok) throw new Error('Failed to fetch verses');
  const data = await res.json();
  return data.verses.map((v: any) => ({
    id: v.id,
    verse_key: v.verse_key,
    text: v.text_uthmani
  }));
}

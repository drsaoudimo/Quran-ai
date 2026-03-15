import { GoogleGenAI } from '@google/genai';

export async function analyzeVerse(verseKey: string, verseText: string, mode: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const ai = new GoogleGenAI({ apiKey });

  let prompt = '';
  switch (mode) {
    case 'explanation':
      prompt = `اشرح الآية التالية شرحاً مبسطاً وميسراً للفهم: "${verseText}" (الآية: ${verseKey})`;
      break;
    case 'asbab':
      prompt = `ما هي أسباب نزول الآية التالية إن وجدت؟ "${verseText}" (الآية: ${verseKey})`;
      break;
    case 'tajweed':
      prompt = `استخرج أهم أحكام التجويد في الآية التالية مع الشرح المبسط: "${verseText}" (الآية: ${verseKey})`;
      break;
    case 'irab':
      prompt = `أعرب الآية التالية إعراباً واضحاً ومفصلاً: "${verseText}" (الآية: ${verseKey})`;
      break;
    default:
      prompt = `تحدث عن الآية التالية: "${verseText}" (الآية: ${verseKey})`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "أنت مساعد ذكي متخصص في علوم القرآن الكريم. أجب باللغة العربية الفصحى وبشكل دقيق وموثوق، واعتمد على المصادر الإسلامية المعتبرة.",
    }
  });

  return response.text;
}

// src/services/gemini.ts
import { GoogleGenAI } from '@google/genai';

// API Anahtarını .env.local dosyasından güvenli bir şekilde al
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY, .env.local dosyasında tanımlı olmalıdır.");
}

// Gemini İstemcisini Başlat
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Kullanıcının seviyesine ve kelimeye özel bir örnek cümle oluşturur.
 * @param word - Örnek cümle kurulacak Almanca kelime
 * @param level - Dil seviyesi (örneğin: 'A1', 'B2', 'C1')
 * @returns Oluşturulan Almanca örnek cümle
 */
export async function generateCustomSentence(word: string, level: string): Promise<string> {

    // Prompt (İstek) Mühendisliği: LLM'e ne yapması gerektiğini söylüyoruz.
    const prompt = `
    Sen bir Almanca öğretmeni ve dil koçusun.
    Öğrenci seviyesi: ${level}.
    Öğrenilmesi gereken kelime: "${word}".

    Bu kelimeyi kullanarak, öğrencinin ${level} seviyesine uygun,
    günlük hayattan bir bağlam içeren, kısa ve net bir Almanca cümle oluştur.
    SADECE cümleyi döndür, başka hiçbir açıklama veya ek bilgi verme.
  `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Hızlı ve düşük maliyetli model
            contents: prompt,
        });

        // Yanıttaki metni temizle ve döndür
        return response.text.trim();

    } catch (error) {
        console.error("Gemini API çağrısı başarısız:", error);
        return `Örnek cümle oluşturulamadı. (Kelime: ${word})`;
    }
}
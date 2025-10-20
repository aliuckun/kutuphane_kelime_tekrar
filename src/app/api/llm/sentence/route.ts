// src/app/api/llm/sentence/route.ts

import { generateCustomSentence } from '../../../../services/gemini';

// Sadece POST isteklerini kabul eden bir API Rotası tanımla
export async function POST(request: Request) {
  try {
    // İsteğin gövdesinden (body) kelime ve seviye bilgilerini al
    const { word, level } = await request.json();

    if (!word || !level) {
      return Response.json({ error: "Eksik kelime veya seviye bilgisi." }, { status: 400 });
    }

    // LLM Servisi ile özel cümle oluştur
    const sentence = await generateCustomSentence(word, level);

    // Başarılı yanıtı döndür
    return Response.json({ sentence });

  } catch (error) {
    console.error('API Rotası Hatası:', error);
    return Response.json({ error: "Sunucu tarafında hata oluştu." }, { status: 500 });
  }
}
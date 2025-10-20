// src/app/api/words/review/route.js

const WordService = require('../../../../services/WordService');

const wordService = new WordService();

/**
 * Tekrar zamanı gelen kelimeleri getirir.
 */
export async function GET(request) {
    try {
        const words = await wordService.getWordsDueForReview();

        // Sadece temel kelime verilerini döndür
        const wordData = words.map(w => w.toCSVObject());

        return Response.json({ words: wordData, count: words.length });

    } catch (error) {
        console.error('Tekrar Listesi Getirme Hatası:', error);
        return Response.json({ error: "Sunucu tarafında kelime listesi getirilemedi." }, { status: 500 });
    }
}

/**
 * Kelimenin tekrar durumunu günceller.
 */
export async function POST(request) {
    try {
        const { almancaWord, quality } = await request.json(); // quality: 1, 3 veya 5

        if (!almancaWord || quality === undefined) {
            return Response.json({ error: "Eksik kelime veya kalite puanı." }, { status: 400 });
        }

        const updatedReview = await wordService.processReview(almancaWord, quality);

        return Response.json({
            success: true,
            message: `Tekrar işlendi. Yeni aralık: ${updatedReview.interval} gün.`,
            review: updatedReview
        });

    } catch (error) {
        console.error('Tekrar İşleme Hatası:', error);
        return Response.json({ error: "Sunucu tarafında tekrar işlenirken hata oluştu." }, { status: 500 });
    }
}
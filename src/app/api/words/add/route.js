// src/app/api/words/add/route.js

const WordService = require('../../../../services/WordService');

const wordService = new WordService();

export async function POST(request) {
    try {
        const { almanca, turkce, tip } = await request.json();

        if (!almanca || !turkce || !tip) {
            return Response.json({ error: "Eksik kelime bilgisi. Lütfen tüm alanları doldurun." }, { status: 400 });
        }

        // WordService'ten gelen sonucu al
        const newWord = await wordService.addNewWord(almanca, turkce, tip);

        // Başarılı yanıt
        return Response.json({
            success: true,
            message: `✅ Kelime başarıyla eklendi: ${newWord.almanca}`,
            word: newWord.toCSVObject()
        });

    } catch (error) {
        console.error('Kelime Ekleme API Hatası:', error.message);

        // ÖZEL HATA YÖNETİMİ: Eğer kelime mevcutsa (WordService'ten gelen hata)
        if (error.message.includes('kelimesi kütüphanede zaten mevcut')) {
            return Response.json({ error: `Kelime zaten mevcut: ${almanca}` }, { status: 409 }); // 409 Conflict
        }

        return Response.json({ error: "Sunucu tarafında hata oluştu." }, { status: 500 });
    }
}
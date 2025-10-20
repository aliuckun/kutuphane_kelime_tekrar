// index.js (SON GÜNCELLEME: Servis Katmanı Testi)
const WordService = require('./src/services/WordService');

async function runTest() {
    console.log("--- Uygulama Servis Katmanı Testi Başlatılıyor ---");

    const wordService = new WordService();

    // 0. Temiz başlangıç için mevcut kelimeleri (yoksa) ekleyelim.
    if ((await wordService.wordRepo.getAllWords()).length < 2) {
        await wordService.addNewWord("die-sonne", "güneş", "isim");
        await wordService.addNewWord("schwimmen", "yüzmek", "fiil");
        console.log("-> 2 yeni kelime eklendi (die-sonne, schwimmen)");
    } else {
        console.log("-> Kütüphanede zaten kelime var. Yeni kelime eklenmedi.");
    }

    // --- 1. Tekrar Edilmesi Gereken Kelimeleri Göster ---

    // Şu an tüm kelimeler yeni eklenmiş olduğu için hepsi tekrar edilmeli varsayılır.
    const wordsToReviewToday = await wordService.getWordsDueForReview();

    console.log(`\n--- TEKRAR İÇİN HAZIR ${wordsToReviewToday.length} KELİME ---`);
    wordsToReviewToday.forEach(word => {
        console.log(`[${word.tip.toUpperCase()}] ${word.almanca}`);
    });

    // --- 2. Bir Kelimeyi Tekrar Etme ve İlerlemeyi Gör ---

    const wordToProcess = wordsToReviewToday[0]; // İlk kelimeyi alalım (die-sonne)

    // 2a. Kelimeyi mükemmel bildi (Quality: 5)
    const reviewResult1 = await wordService.processReview(wordToProcess.almanca, 5);
    console.log(`\n'${wordToProcess.almanca}' - Bilindi (5): Yeni aralık ${reviewResult1.interval} gün.`);

    // 2b. Kelimeyi 2. kez bilme simülasyonu (6 gün aralık beklenir)
    // Bunun için zamanı 1 gün ileri almamız gerekir. Bu testte sadece aralığa bakalım.
    const reviewResult2 = await wordService.processReview(wordToProcess.almanca, 5);
    console.log(`'${wordToProcess.almanca}' - 2. Tekrar Bilindi (5): Yeni aralık ${reviewResult2.interval} gün.`);

    // --- 3. Tekrar Edilmesi Gereken Kelimeleri Tekrar Göster ---

    // İlk kelime tekrar edildiği için artık listede olmamalıdır (Çünkü tekrar tarihi ileri alındı).
    const wordsToReviewAfterUpdate = await wordService.getWordsDueForReview();
    console.log(`\n--- GÜNCELLEME SONRASI HAZIR ${wordsToReviewAfterUpdate.length} KELİME ---`);
}

runTest();
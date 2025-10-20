// src/lib/SRS.js
const ReviewData = require('../models/ReviewData');

// Yardımcı fonksiyon: Unix zamanına gün ekler
const addDays = (timestamp, days) => {
    const date = new Date(timestamp);
    date.setDate(date.getDate() + days);
    return date.getTime();
};

/**
 * Aralıklı Tekrar Sistemi (SuperMemo 2 Algoritması'ndan esinlenilmiştir)
 * @param {ReviewData} reviewData - Kelimenin mevcut tekrar verisi
 * @param {number} quality - Kullanıcının hatırlama kalitesi (0=unuttum, 3=iyi, 5=mükemmel)
 * @returns {ReviewData} Güncellenmiş ReviewData nesnesi
 */
const calculateSRS = (reviewData, quality) => {
    let { repetitions, easeFactor, interval, nextReviewDate, wordId } = reviewData;

    // Kaliteyi (quality) 0-5 arasında sınırla
    quality = Math.max(0, Math.min(5, quality));

    // 1. Eğer unuttuysa (quality < 3)
    if (quality < 3) {
        repetitions = 0; // Tekrar sayısı sıfırlanır
        interval = 1; // Bir sonraki tekrar yarın
    } else {
        // 2. Kolaylık Faktörünü (Ease Factor) Güncelle
        // EF, kelimenin ne kadar kolay olduğunu gösterir. 2.5 ile 1.3 arasında kalır.
        const newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        easeFactor = Math.max(1.3, newEaseFactor); // Min 1.3

        // 3. Tekrar Sayısını ve Aralığı Hesapla
        repetitions++;

        if (repetitions === 1) {
            interval = 1; // İlk başarılı tekrar: 1 gün sonra
        } else if (repetitions === 2) {
            interval = 6; // İkinci başarılı tekrar: 6 gün sonra
        } else {
            // Üçüncü ve sonrası: Önceki aralık * Kolaylık Faktörü
            interval = Math.round(interval * easeFactor);
        }
    }

    // 4. Bir Sonraki Tekrar Tarihini Belirle
    nextReviewDate = addDays(Date.now(), interval);

    // Yeni ReviewData nesnesini döndür
    return new ReviewData(wordId, repetitions, easeFactor, interval, nextReviewDate);
};

module.exports = {
    ReviewData,
    calculateSRS
};
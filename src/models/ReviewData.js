// src/models/ReviewData.js

/**
 * Bir kelimenin tekrar ilerlemesini tutan model.
 */
class ReviewData {
    /**
     * @param {string} wordId - Bağlantılı Kelime'nin ID'si (CSV'de kelimeyi temsil eden Almanca kelimeyi kullanacağız)
     * @param {number} repetitions - Kelime kaç kez doğru tekrarlandı (0'dan başlar)
     * @param {number} easeFactor - Kelimenin kolaylık faktörü (1.3 - 2.5 arası)
     * @param {number} interval - Tekrar aralığı (gün cinsinden)
     * @param {number} nextReviewDate - Bir sonraki tekrar tarihi (Unix zaman damgası)
     */
    constructor(wordId, repetitions = 0, easeFactor = 2.5, interval = 0, nextReviewDate = Date.now()) {
        this.wordId = wordId;
        this.repetitions = repetitions;
        this.easeFactor = easeFactor;
        this.interval = interval;
        this.nextReviewDate = nextReviewDate;
    }

    // CSV formatına uygun obje döndüren metod
    toCSVObject() {
        return {
            wordId: this.wordId,
            repetitions: this.repetitions,
            easeFactor: this.easeFactor,
            interval: this.interval,
            nextReviewDate: this.nextReviewDate
        };
    }
}

module.exports = ReviewData;
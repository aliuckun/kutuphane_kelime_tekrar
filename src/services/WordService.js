// src/services/WordService.js

const WordRepository = require('../data/WordRepository');
const ReviewRepository = require('../data/ReviewRepository');
const { calculateSRS, ReviewData } = require('../lib/SRS');
const Word = require('../models/Word');

class WordService {
    constructor() {
        this.wordRepo = new WordRepository();
        this.reviewRepo = new ReviewRepository();
    }

    /**
     * Tekrar zamanı gelmiş kelimeleri getirir.
     * @returns {Promise<Word[]>} Tekrar edilmesi gereken kelimelerin listesi
     */
    async getWordsDueForReview() {
        const allWords = await this.wordRepo.getAllWords();
        const allReviews = await this.reviewRepo.getAllReviews();
        const now = Date.now();

        const wordsDue = [];

        for (const word of allWords) {
            // İlgili kelimenin tekrar verisini bul
            const reviewData = allReviews.find(r => r.wordId === word.almanca);

            // Eğer review verisi yoksa (yeni kelime), bugün tekrar edilmeli varsayılır.
            if (!reviewData || reviewData.nextReviewDate <= now) {
                wordsDue.push(word);
            }
        }

        // Tekrar zamanı gelen kelimeleri, bir sonraki tekrar tarihine göre sırala (Eskiden yeniye)
        wordsDue.sort((a, b) => {
            const reviewA = allReviews.find(r => r.wordId === a.almanca) || new ReviewData(a.almanca);
            const reviewB = allReviews.find(r => r.wordId === b.almanca) || new ReviewData(b.almanca);
            return reviewA.nextReviewDate - reviewB.nextReviewDate;
        });

        return wordsDue;
    }

    /**
     * Kullanıcının hatırlama kalitesine göre kelimenin tekrar verisini günceller.
     * @param {string} almancaWord - Güncellenecek Almanca kelime (ID olarak kullanılıyor)
     * @param {number} quality - Hatırlama kalitesi (1: Unutuldu - 5: Mükemmel)
     */
    async processReview(almancaWord, quality) {
        let existingReview = (await this.reviewRepo.getAllReviews())
            .find(r => r.wordId === almancaWord);

        // Eğer ilk kez tekrar ediliyorsa, varsayılan bir ReviewData oluştur.
        if (!existingReview) {
            existingReview = new ReviewData(almancaWord);
        }

        // SRS algoritmasını kullanarak yeni tekrar verilerini hesapla
        const updatedReview = calculateSRS(existingReview, quality);

        // Yeni veriyi kaydet
        await this.reviewRepo.saveReview(updatedReview);

        return updatedReview;
    }


    /**
     * Yeni bir kelime ekler. Kelime mevcutsa hata döndürür.
     * @param {string} almanca - Almanca kelime
     * @param {string} turkce - Türkçe çevirisi
     * @param {string} tip - Kelime tipi
     */

    async addNewWord(almanca, turkce, tip) {
        // 1. VARLIK KONTROLÜ
        const exists = await this.wordRepo.wordExists(almanca);
        if (exists) {
            // Eğer kelime zaten varsa, iş mantığı katmanında hata fırlat
            throw new Error(`'${almanca}' kelimesi kütüphanede zaten mevcut.`);
        }

        // 2. KELİMEYİ OLUŞTUR VE KAYDET
        const newWord = new Word(almanca, turkce, tip);

        // WordRepo'ya kaydet (Önceki güvenli yazma mantığı burada çalışır)
        await this.wordRepo.addWord(newWord);

        // 3. Başlangıç ReviewData kaydını oluştur ve kaydet
        const initialReview = new ReviewData(almanca);
        await this.reviewRepo.saveReview(initialReview);

        return newWord;
    }

    // ... Diğer CRUD işlemleri (kelime silme, kelime listeleme vb.) buraya eklenebilir.
}

module.exports = WordService;
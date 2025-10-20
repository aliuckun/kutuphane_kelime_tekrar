// src/data/ReviewRepository.js (Bu, WordRepository'nin mantığını takip eder)
const fs = require('fs/promises');
const { createObjectCsvWriter } = require('csv-writer');
const { ReviewData } = require('../lib/SRS'); // ReviewData modelini içeri aktar
const path = require('path');
const csv = require('csv-parser');

const CSV_HEADERS = [
    { id: 'wordId', title: 'wordId' },
    { id: 'repetitions', title: 'repetitions' },
    { id: 'easeFactor', title: 'easeFactor' },
    { id: 'interval', title: 'interval' },
    { id: 'nextReviewDate', title: 'nextReviewDate' }
];

class ReviewRepository {
    constructor(filePath = 'data/reviews.csv') {
        this.filePath = path.join(process.cwd(), filePath);
    }

    async getAllReviews() {
        // WordRepository'deki getAllWords mantığına benzer
        try {
            await fs.access(this.filePath);
        } catch (error) {
            return [];
        }

        const results = [];
        return new Promise((resolve, reject) => {
            require('fs').createReadStream(this.filePath)
                .pipe(csv())
                .on('data', (data) => {
                    // Veriyi ReviewData nesnesine dönüştür
                    if (data.wordId) {
                        const review = new ReviewData(
                            data.wordId,
                            parseInt(data.repetitions),
                            parseFloat(data.easeFactor),
                            parseInt(data.interval),
                            parseInt(data.nextReviewDate)
                        );
                        results.push(review);
                    }
                })
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    /**
     * Güncellenmiş (veya yeni) ReviewData'yı kaydeder.
     * @param {ReviewData} newReview - Kaydedilecek ReviewData nesnesi
     */
    async saveReview(newReview) {
        if (!(newReview instanceof ReviewData)) {
            throw new Error("Kaydedilecek nesne bir ReviewData örneği olmalıdır.");
        }

        const allReviews = await this.getAllReviews();
        const existingIndex = allReviews.findIndex(r => r.wordId === newReview.wordId);

        if (existingIndex !== -1) {
            allReviews[existingIndex] = newReview; // Mevcut kaydı güncelle
        } else {
            allReviews.push(newReview); // Yeni kaydı ekle
        }

        // Tüm listeyi yeniden yaz (WordRepository'deki güvenli mantık)
        const csvWriter = createObjectCsvWriter({
            path: this.filePath,
            header: CSV_HEADERS,
            append: false
        });

        const records = allReviews.map(r => r.toCSVObject());
        await csvWriter.writeRecords(records);
    }
}

module.exports = ReviewRepository;
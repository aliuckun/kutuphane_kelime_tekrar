// src/data/WordRepository.js
const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const Word = require('../models/Word');
const path = require('path');

class WordRepository {
    constructor(filePath = 'data/words.csv') {
        // Dosya yolunu proje köküne göre ayarlıyoruz
        this.filePath = path.join(process.cwd(), filePath);
        this.csvWriter = createObjectCsvWriter({
            path: this.filePath,
            header: [
                { id: 'almanca', title: 'almanca' },
                { id: 'turkce', title: 'turkce' },
                { id: 'tip', title: 'tip' }
            ],
            append: true // Yeni kelimeleri dosyanın sonuna ekler
        });
    }

    /**
     * CSV dosyasındaki tüm kelimeleri okur ve Word nesneleri olarak döndürür.
     * @returns {Promise<Word[]>}
     */
    async getAllWords() {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }

        const results = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.filePath)
                .pipe(csv())
                .on('data', (data) => {
                    // CSV'den gelen ham veriyi Word nesnesine dönüştürüyoruz
                    try {
                        const wordInstance = new Word(data.almanca, data.turkce, data.tip);
                        results.push(wordInstance);
                    } catch (error) {
                        console.error("Hatalı CSV satırı atlandı:", data);
                    }
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    /**
     * Belirtilen Almanca kelimenin depoda var olup olmadığını kontrol eder.
     * @param {string} almancaWord - Kontrol edilecek Almanca kelime
     * @returns {Promise<boolean>} Kelime varsa true, yoksa false
     */
    async wordExists(almancaWord) {
        const allWords = await this.getAllWords();
        // Almanca kelimeyi küçük harfe çevirerek kontrol etmek tutarlıdır
        const normalizedWord = almancaWord.toLowerCase();

        return allWords.some(word => word.almanca.toLowerCase() === normalizedWord);
    }

    /**
    * Yeni bir Word nesnesini CSV dosyasına kaydeder.
        * @param {Word} word - Kaydedilecek Word nesnesi
        */
    async addWord(word) {
        if (!(word instanceof Word)) {
            throw new Error("Kaydedilecek nesne bir Word örneği olmalıdır.");
        }

        // --- KRİTİK DÜZELTME: Dosya yoksa SADECE bir kere başlık satırını yazdırıyoruz.
        if (!fs.existsSync(this.filePath)) {
            // writeRecords'ı append:true ile çağırmadan önce sadece başlık yazan yeni bir writer kuralım:
            const initialWriter = createObjectCsvWriter({
                path: this.filePath,
                header: [
                    { id: 'almanca', title: 'almanca' },
                    { id: 'turkce', title: 'turkce' },
                    { id: 'tip', title: 'tip' }
                ],
                append: false // Başlık satırını ilk ve tek yazdığı için append olmasın
            });
            await initialWriter.writeRecords([]); // Boş kayıt yazarak sadece başlıkları yazar
        }

        // Kelimeyi CSV formatına dönüştürüp kaydet (append: true olan writer'ı kullanıyoruz)
        await this.csvWriter.writeRecords([word.toCSVObject()]);
    }
}


module.exports = WordRepository;
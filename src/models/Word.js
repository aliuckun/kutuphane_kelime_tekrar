// src/models/Word.js

/**
 * Kelime modelini temsil eden sınıf.
 * Bu, bir "Almanca Kelime" nesnesinin nasıl görüneceğini tanımlar.
 */
class Word {
    /**
     * @param {string} almanca - Kelimenin Almanca karşılığı
     * @param {string} turkce - Kelimenin Türkçe karşılığı
     * @param {string} tip - Kelime tipi (örneğin, 'isim', 'fiil', 'sıfat')
     */
    constructor(almanca, turkce, tip) {
        if (!almanca || !turkce || !tip) {
            throw new Error("Kelime oluşturmak için tüm alanlar (almanca, turkce, tip) zorunludur.");
        }

        this.almanca = almanca;
        this.turkce = turkce;
        this.tip = tip.toLowerCase(); // Tipi küçük harfe çevirerek tutarlılık sağlıyoruz
    }

    // Kelimenin okunabilir bir formatını döndüren metod
    toString() {
        return `[${this.tip.toUpperCase()}] ${this.almanca}: ${this.turkce}`;
    }

    // CSV formatına uygun obje döndüren metod
    toCSVObject() {
        return {
            almanca: this.almanca,
            turkce: this.turkce,
            tip: this.tip
        };
    }
}

module.exports = Word;
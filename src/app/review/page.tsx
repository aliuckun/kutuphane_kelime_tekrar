// src/app/review/page.tsx
'use client';
import Navigation from '../../components/Navigation';
import React, { useState, useEffect } from 'react';
import { WordData } from '../../lib/types/word'; // Daha önce tanımladığımız tip
import { IoEye, IoRepeat, IoCheckmarkCircle, IoCloseCircle, IoHelpCircle } from 'react-icons/io5'; // Tailwind için ikon kütüphanesi

// *** Not: İkon kütüphanesini kullanabilmek için terminalde bir kez: `npm install react-icons` komutunu çalıştırmanız gerekebilir.

export default function ReviewPage() {
    const [words, setWords] = useState<WordData[]>([]); // Tekrar edilecek tüm kelimeler
    const [currentIndex, setCurrentIndex] = useState(0); // Şu anki kelimenin indeksi
    const [showAnswer, setShowAnswer] = useState(false); // Cevabı göster/gizle
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Şu anki kelime
    const currentWord = words[currentIndex];

    // Sayfa yüklendiğinde tekrar kelimelerini çek
    useEffect(() => {
        fetchWordsForReview();
    }, []);

    const fetchWordsForReview = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/words/review');
            const data = await response.json();

            if (response.ok) {
                // Kelimeler sıralı geleceği için direkt set ediyoruz
                setWords(data.words);
            } else {
                setError(`API Hatası: ${data.error}`);
            }
        } catch (err) {
            setError('Ağ hatası veya sunucu hatası.');
        } finally {
            setLoading(false);
        }
    };

    // Kullanıcının geri bildirimini işleyen ana fonksiyon (SRS Algoritmasını tetikler)
    const handleReviewFeedback = async (quality: number) => {
        setLoading(true);
        setShowAnswer(false);

        try {
            // API'a POST isteği gönder (alınan puanı kaydet)
            const response = await fetch('/api/words/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    almancaWord: currentWord.almanca,
                    quality: quality
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message); // Yeni aralığı konsola bas
            } else {
                setError(`Tekrar işlenirken hata: ${data.error}`);
            }
        } catch (err) {
            setError('Tekrar kaydı sırasında ağ hatası.');
        } finally {
            setLoading(false);

            // Sonraki kelimeye geç
            if (currentIndex < words.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Tüm kelimeler bitti, listeyi temizle
                setWords([]);
            }
        }
    };

    // Yüklenme ve Hata Durumu
    if (loading && words.length === 0) {
        return <LoadingScreen message="Tekrar kelimeleri yükleniyor..." />;
    }
    if (error) {
        return <LoadingScreen message={`HATA: ${error}`} isError={true} />;
    }

    // Tekrar Akışı Kontrolü
    if (!currentWord) {
        return <LoadingScreen message="🎉 Bugün için tüm tekrarlar tamamlandı! Tebrikler." />;
    }

    return (
        <div>
            <Navigation />
            <main className="p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Kelime Tekrar Oturumu</h1>

                <div className="text-center text-lg font-medium mb-6 text-gray-600">
                    Kalan Kelime: {words.length - currentIndex} / {words.length}
                </div>

                {/* Kelime Kartı */}
                <div className="bg-white p-10 rounded-xl shadow-2xl border-t-4 border-blue-500">

                    {/* Soru Kısmı */}
                    <div className="min-h-[100px] flex flex-col justify-center items-center">
                        <p className="text-sm text-gray-500 mb-2">{currentWord.tip.toUpperCase()}</p>
                        <p className="text-5xl font-extrabold text-gray-900 mb-6">{currentWord.almanca}</p>
                    </div>

                    {/* Cevabı Göster Butonu */}
                    {!showAnswer && (
                        <button
                            onClick={() => setShowAnswer(true)}
                            className="w-full py-3 mt-4 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition-colors flex items-center justify-center"
                        >
                            <IoEye className="mr-2" /> Cevabı Göster
                        </button>
                    )}

                    {/* Cevap ve Puanlama Butonları */}
                    {showAnswer && (
                        <div className="mt-6 border-t pt-6">
                            <p className="text-3xl font-bold text-green-700 mb-6 text-center">{currentWord.turkce}</p>

                            <div className="grid grid-cols-3 gap-3">
                                <ReviewButton icon={<IoCloseCircle />} label="Unuttum" quality={1} onClick={handleReviewFeedback} color="red" />
                                <ReviewButton icon={<IoRepeat />} label="Orta" quality={3} onClick={handleReviewFeedback} color="yellow" />
                                <ReviewButton icon={<IoCheckmarkCircle />} label="Biliyorum" quality={5} onClick={handleReviewFeedback} color="green" />
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-4">Unuttum: 1 gün sonra, Biliyorum: Yeni aralığa göre tekrar.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Basit Yardımcı Bileşenler
const ReviewButton = ({ icon, label, quality, onClick, color }: any) => (
    <button
        onClick={() => onClick(quality)}
        className={`flex flex-col items-center justify-center p-3 rounded-lg text-white bg-${color}-500 hover:bg-${color}-600 transition-colors disabled:opacity-50`}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const LoadingScreen = ({ message, isError = false }: { message: string, isError?: boolean }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <IoHelpCircle className={`text-6xl ${isError ? 'text-red-500' : 'text-blue-500'} mb-4`} />
        <p className={`text-xl font-semibold ${isError ? 'text-red-600' : 'text-gray-700'}`}>{message}</p>
    </div>
);
// src/app/llm/sentence/page.tsx
'use client';
import Navigation from '../../../components/Navigation';
import React, { useState } from 'react';
import { IoSparklesOutline, IoBookOutline } from 'react-icons/io5';

// API Rotasına gönderilen verinin tipi
type SentenceRequest = {
    word: string;
    level: string;
};

// API'dan gelen yanıtın tipi
type SentenceResponse = {
    sentence: string;
    error?: string;
};


export default function LLMSentenceGeneratorPage() {
    const [word, setWord] = useState('sprechen'); // Varsayılan örnek
    const [level, setLevel] = useState('B1');
    const [sentence, setSentence] = useState('Oluşturmak için butona tıklayın veya kelime/seviye girin.');
    const [isLoading, setIsLoading] = useState(false);

    // Yaygın kullanılan dil seviyeleri
    const levelOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    const generateSentence = async () => {
        if (!word.trim() || !level.trim()) {
            setSentence("Lütfen hem kelimeyi hem de seviyeyi girin.");
            return;
        }

        setIsLoading(true);
        setSentence('🤖 Gemini zekice bir cümle oluşturuyor...');

        try {
            // API Rotasına istek gönder
            const response = await fetch('/api/llm/sentence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word, level } as SentenceRequest),
            });

            const data: SentenceResponse = await response.json();

            if (response.ok && data.sentence) {
                setSentence(data.sentence);
            } else {
                setSentence(`Hata: ${data.error || 'Bilinmeyen sunucu hatası.'}`);
                console.error("API Yanıt Hatası:", data.error);
            }
        } catch (error) {
            setSentence('Ağ hatası: Sunucuya bağlanılamadı.');
            console.error("Ağ Hatası:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Navigation />
            <main className="p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-extrabold mb-4 text-center text-gray-800 flex items-center justify-center">
                    <IoSparklesOutline className="text-blue-500 mr-3 text-4xl" />
                    LLM Destekli Dinamik Cümle Oluşturucu
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    Seviyenize ve seçtiğiniz kelimeye özel, bağlamsal örnek cümleler üretin.
                </p>

                <div className="bg-white p-6 rounded-xl shadow-2xl space-y-5 border-t-4 border-blue-500">

                    {/* Kelime Girişi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Almanca Kelime (Derste Öğrendiğiniz)</label>
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            disabled={isLoading}
                            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Örn: lernen, die-katze"
                        />
                    </div>

                    {/* Seviye Seçimi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dil Seviyesi (CEFR)</label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            disabled={isLoading}
                            className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            {levelOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Buton */}
                    <button
                        onClick={generateSentence}
                        disabled={isLoading || !word.trim() || !level.trim()}
                        className="w-full py-3 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 flex items-center justify-center"
                    >
                        <IoBookOutline className="mr-2" />
                        {isLoading ? 'Cümle Oluşturuluyor...' : `Örnek Cümle Oluştur (Gemini ${level})`}
                    </button>
                </div>

                {/* Sonuç Alanı */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Oluşturulan Cümle:</h2>
                    <p className={`text-2xl font-medium ${isLoading ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                        {sentence}
                    </p>
                </div>

            </main>
        </div>
    );
}
// src/app/add/page.tsx
'use client';
import Navigation from '../../components/Navigation'; // Doğru yol formatına geri döndük
import React, { useState } from 'react';
import { IoSaveOutline, IoWarningOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

// ===========================================
// YARDIMCI BİLEŞENLER (EN ÜSTTE TANIMLANIR)
// ===========================================

// Yardımcı Bileşen: Input Alanı
const InputField = ({ label, value, onChange, isLoading, placeholder }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            required
            // STİL GÜNCELLEMESİ: Koyu temaya uygun input stili
            className="mt-1 block w-full p-3 border border-gray-600 rounded-lg shadow-inner bg-gray-700 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder={placeholder}
        />
    </div>
);

// Yardımcı Bileşen: Mesaj Kutusu
const MessageDisplay = ({ message }: { message: string }) => {
    const isSuccess = message.startsWith('✅');
    const isError = message.startsWith('❌') || message.includes('zaten mevcut');
    // STİL GÜNCELLEMESİ: Koyu temada uyumlu renkler
    const bgColor = isError ? 'bg-red-900/50 border-red-700' : 'bg-green-900/50 border-green-700';
    const icon = isError ? <IoWarningOutline className="text-red-400 mr-2 text-xl" /> : <IoCheckmarkCircleOutline className="text-green-400 mr-2 text-xl" />;

    return (
        <p className={`mt-6 p-4 rounded-lg text-sm font-semibold border ${bgColor} text-gray-100 flex items-center`}>
            {icon}
            {message.replace('❌ Hata: ', '').replace('✅ ', '')}
        </p>
    );
};

// ===========================================
// ANA BİLEŞEN (ADDWORDPAGE)
// ===========================================

export default function AddWordPage() {
    const [almanca, setAlmanca] = useState('');
    const [turkce, setTurkce] = useState('');
    const [tip, setTip] = useState('isim');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const tipOptions = ['isim', 'fiil', 'sıfat', 'zarf', 'diğer'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/words/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ almanca, turkce, tip }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`✅ ${data.message}`);
                setAlmanca('');
                setTurkce('');
                setTip('isim'); // Reset tip
            } else {
                setMessage(`❌ Hata: ${data.error || 'Bilinmeyen bir hata oluştu.'}`);
            }
        } catch (error) {
            setMessage('Ağ hatası: Sunucuya bağlanılamadı.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Navigation />
            <main className="p-8 max-w-xl mx-auto"> {/* Formun genişliğini sınırlar ve ortalar */}
                <h1 className="text-3xl font-bold mb-8 text-white">Kelime Kütüphanesine Kayıt</h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">

                    {/* Almanca Kelime */}
                    <InputField
                        label="Almanca Kelime"
                        value={almanca}
                        onChange={setAlmanca}
                        isLoading={isLoading}
                        placeholder="Örn: die-tasche"
                    />

                    {/* Türkçe Anlamı */}
                    <InputField
                        label="Türkçe Anlamı"
                        value={turkce}
                        onChange={setTurkce}
                        isLoading={isLoading}
                        placeholder="Örn: çanta"
                    />

                    {/* Tip Seçimi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Kelime Tipi</label>
                        <select
                            value={tip}
                            onChange={(e) => setTip(e.target.value)}
                            disabled={isLoading}
                            // STİL GÜNCELLEMESİ: Koyu temaya uygun select stili
                            className="mt-1 block w-full p-3 border border-gray-600 rounded-lg shadow-inner bg-gray-700 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            {tipOptions.map(opt => (
                                <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Kaydet Butonu - Gradient Efekti */}
                    <button
                        type="submit"
                        disabled={isLoading || !almanca.trim() || !turkce.trim()}
                        // STİL GÜNCELLEMESİ: Canlı, vurgulu gradient buton
                        className="w-full py-3 px-4 rounded-lg font-extrabold text-gray-900 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                        <IoSaveOutline className="mr-2 text-xl" />
                        {isLoading ? 'Kayıt Kontrol Ediliyor...' : 'Kelimeyi Kaydet'}
                    </button>
                </form>

                {/* Mesaj Kutusu */}
                {message && (
                    <MessageDisplay message={message} />
                )}

            </main>
        </div>
    );
}

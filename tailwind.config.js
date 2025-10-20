/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    // KRİTİK GÜNCELLEME: Temel renkleri derlemeye zorla (Safelist)
    safelist: [
        // Genel Arkaplan ve Metin Renkleri
        'bg-gray-950',
        'text-gray-200',
        // Mesaj Kutusu Renkleri (Hata/Başarı)
        'bg-red-900/50',
        'border-red-700',
        'bg-green-900/50',
        'border-green-700',
        // Vurgu Renkleri
        'from-cyan-400',
        'to-teal-500',
        'hover:from-cyan-500',
        'hover:to-teal-600',
    ],
}
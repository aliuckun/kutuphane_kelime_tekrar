// src/app/page.tsx (Görsel Olarak Güncellenmiş)
'use client';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { IoAddCircleOutline, IoRepeat, IoSparkles } from 'react-icons/io5';

// Basit Card Bileşeni - Koyu temada parlayan kart
const DashboardCard = ({ title, description, link, icon: Icon }: { title: string, description: string, link: string, icon: any }) => (
    <Link
        href={link}
        className="block p-6 bg-gray-800 rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.03] border border-gray-700 hover:border-cyan-500"
    >
        <Icon className="text-4xl text-cyan-400 mb-3" />
        <h2 className="text-xl font-bold mb-2 text-cyan-300">{title}</h2>
        <p className="text-gray-400 text-sm">{description}</p>
    </Link>
);

// Ana Dashboard Sayfası
export default function HomePage() {
    return (
        <div>
            <Navigation />

            <main className="p-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-2 text-white tracking-tight">
                    Dil Öğrenme Paneli
                </h1>
                <p className="text-gray-400 mb-10 text-lg">
                    Kütüphanenizi yönetin ve öğrenme akışınızı başlatın.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <DashboardCard
                        title="Kelime Ekle"
                        description="Yeni kelimeleri, Türkçe anlamları ve tipleriyle birlikte çevrimdışı kütüphanenize kaydedin."
                        link="/add"
                        icon={IoAddCircleOutline}
                    />

                    <DashboardCard
                        title="Kelime Tekrarı Başlat"
                        description="Aralıklı Tekrar Sistemi (SRS) ile unutulmaya yüz tutan kelimeleri tekrar edin. Zamanlama bilimseldir!"
                        link="/review"
                        icon={IoRepeat}
                    />

                    <DashboardCard
                        title="AI Cümle Oluşturucu"
                        description="Gemini'nın gücüyle seviyenize uygun, dinamik ve bağlamsal örnek cümleler üretin."
                        link="/llm/sentence"
                        icon={IoSparkles}
                    />

                </div>
            </main>
        </div>
    );
}
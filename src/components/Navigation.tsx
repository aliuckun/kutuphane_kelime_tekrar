// src/components/Navigation.tsx (Görsel olarak güncellenmiş)
import Link from 'next/link';

export default function Navigation() {
  const navItems = [
    { name: 'Pano', href: '/' },
    { name: 'Kelime Ekle', href: '/add' },
    { name: 'Tekrar', href: '/review' },
    { name: 'AI Cümleler', href: '/llm/sentence' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div className="flex justify-center md:justify-start space-x-6 max-w-6xl mx-auto p-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            // Link Stili: Canlı mavi vurgu
            className="text-gray-300 hover:text-cyan-400 font-medium text-sm transition-colors duration-200 tracking-wider"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
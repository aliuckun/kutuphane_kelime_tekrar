import '../globals.css'; // Tailwind CSS'in içe aktarıldığı yer

export const metadata = {
  title: 'Dil Öğrenme Uygulaması', // Başlık güncellendi
  description: 'LLM Destekli Kelime ve Tekrar Sistemi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      {/* Koyu Temayı (bg-gray-950) ve Metin Rengini (text-gray-200) uygula */}
      <body className="bg-gray-950 text-gray-200 antialiased min-h-screen transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}
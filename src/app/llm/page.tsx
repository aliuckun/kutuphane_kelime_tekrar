// src/app/llm/sentence/page.tsx (Önceki test kodumuzun yeni yeri)
'use client';
import React, { useState } from 'react';
import Navigation from '../../components/Navigation'; // Navigasyonu da ekleyelim

// ... (generateSentence, Home fonksiyonları ve UI JSX kodu buraya gelecek)

export default function Home() {
    // ... (state ve generateSentence fonksiyonları)

    // LLM Arayüz kodunu buraya yapıştırın
    return (
        <div>
            <Navigation />
            <div className="p-8 max-w-xl mx-auto">
                {/* ... geri kalan arayüz kodu ... */}
            </div>
        </div>
    );
}
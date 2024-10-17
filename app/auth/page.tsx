'use client';

import React from 'react';
import { AuthComponent } from '@/components/Login';
import { Playfair_Display, Inter } from 'next/font/google';
import Link from 'next/link';

// Initialize the fonts
const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export default function AuthPage() {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className={`${playfair.className} text-2xl font-bold text-gray-900`}>
            ExamVault
          </Link>
          <nav>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <AuthComponent />
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ExamVault. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
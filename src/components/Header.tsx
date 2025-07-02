'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isAtTop, setIsAtTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      const isAtTop = window.scrollY === 0 && window.location.pathname === '/' && !window.location.hash;
      setIsAtTop(isAtTop);
    };

    checkPosition();
    
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('hashchange', checkPosition);
    
    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('hashchange', checkPosition);
    };
  }, []);

  return (
    <header className={`w-full py-4 px-6 md:px-12 border-b border-gray-200 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isAtTop ? 'bg-transparent' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/Fig1_Finallogo.png"
              alt="Fig1 Logo"
              width={120}
              height={40}
              className="h-10 w-auto cursor-pointer"
            />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 transition-colors text-sm font-medium hover:text-[#D959B3]">
            HOME
          </Link>
          <Link href="/team" className="text-gray-600 transition-colors text-sm font-medium hover:text-[#D959B3]">
            TEAM
          </Link>
          <Link href="/blog" className="text-gray-600 transition-colors text-sm font-medium hover:text-[#D959B3]">
            BLOG
          </Link>
          <a href="https://www.fig1.ai" target="_blank" rel="noopener noreferrer" className="text-gray-600 transition-colors text-sm font-medium hover:text-[#D959B3]">
            FIG.1 AI
          </a>
          <a href="/#contact" className="border border-gray-400 text-gray-600 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:border-[#D959B3] hover:text-[#D959B3]">
            CONTACT US
          </a>
        </nav>
        
        <button 
          className="md:hidden text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-6 py-4 space-y-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 transition-colors text-sm font-medium hover:text-[#D959B3]">
              HOME
            </Link>
            <Link href="/team" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 transition-colors text-sm font-medium hover:text-[#D959B3]">
              TEAM
            </Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 transition-colors text-sm font-medium hover:text-[#D959B3]">
              BLOG
            </Link>
            <a href="https://www.fig1.ai" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-600 transition-colors text-sm font-medium hover:text-[#D959B3]">
              FIG.1 AI
            </a>
            <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="block border border-gray-400 text-gray-600 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:border-[#D959B3] hover:text-[#D959B3] text-center">
              CONTACT US
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
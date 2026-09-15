'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Theater } from 'lucide-react';
import SocialLinks from './SocialLinks';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Upcoming Show', href: '/upcoming' },
  { name: 'Past Productions', href: '/past-productions' },
  { name: 'About & History', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Join Us / Contact', href: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Theater className="h-8 w-8 text-primary-700 group-hover:text-primary-600 transition-colors" />
            <span className="font-display text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
              MMTC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-primary-700 font-medium text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Links - Desktop */}
          <div className="hidden lg:flex items-center">
            <SocialLinks iconSize={20} />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary-700 hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-gray-50 rounded-md font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 px-4">
              <p className="text-xs text-gray-500 mb-2">Follow us</p>
              <SocialLinks iconSize={22} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

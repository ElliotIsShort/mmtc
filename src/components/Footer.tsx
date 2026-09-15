'use client';

import Link from 'next/link';
import { Theater, Mail, MapPin } from 'lucide-react';
import SocialLinks from './SocialLinks';

const QUICK_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Upcoming Show', href: '/upcoming' },
  { name: 'Past Productions', href: '/past-productions' },
  { name: 'About Us', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Theater className="h-8 w-8 text-primary-400" />
              <span className="font-display text-xl font-bold text-white">
                Melyncrythan Musical Theatre Company
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Bringing the magic of musical theatre to Neath and the surrounding valleys since 1923.
              We are a registered charity dedicated to promoting the performing arts in our community.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-400" />
                <span>Gwyn Hall, Neath, Wales</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary-400" />
                <a href="mailto:info@mmtc.org.uk" className="hover:text-primary-400 transition-colors">
                  info@mmtc.org.uk
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Admin */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect With Us</h3>
            <SocialLinks iconSize={28} className="mb-6" />
            <div className="pt-4 border-t border-gray-700">
              <Link
                href="/admin"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Melyncrythan Musical Theatre Company. All rights reserved.
            </p>
            <p className="text-xs text-gray-600">
              Registered Charity No. 1234567
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

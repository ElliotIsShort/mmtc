'use client';

import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
}

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/mmtc', // Update with actual URL
    icon: Facebook,
    color: 'hover:text-blue-600',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/mmtc', // Update with actual URL
    icon: Instagram,
    color: 'hover:text-pink-600',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@mmtc', // Update with actual URL
    icon: Youtube,
    color: 'hover:text-red-600',
  },
  {
    name: 'X / Twitter',
    href: 'https://twitter.com/mmtc', // Update with actual URL
    icon: Twitter,
    color: 'hover:text-sky-500',
  },
];

export default function SocialLinks({
  className = '',
  iconSize = 24,
  showLabels = false,
}: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-600 transition-colors duration-200 ${social.color} flex items-center gap-2`}
          aria-label={`Follow us on ${social.name}`}
        >
          <social.icon size={iconSize} />
          {showLabels && <span className="text-sm">{social.name}</span>}
        </a>
      ))}
    </div>
  );
}

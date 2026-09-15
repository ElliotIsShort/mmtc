'use client';

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
}

// Custom SVG icons for social media (lucide-react doesn't include brand icons)
const FacebookSvg = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramSvg = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeSvg = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
  </svg>
);

const TwitterXSvg = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/mmtc', // Update with actual URL
    Icon: FacebookSvg,
    color: 'hover:text-blue-600',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/mmtc', // Update with actual URL
    Icon: InstagramSvg,
    color: 'hover:text-pink-600',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@mmtc', // Update with actual URL
    Icon: YoutubeSvg,
    color: 'hover:text-red-600',
  },
  {
    name: 'X / Twitter',
    href: 'https://twitter.com/mmtc', // Update with actual URL
    Icon: TwitterXSvg,
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
          <social.Icon size={iconSize} />
          {showLabels && <span className="text-sm">{social.name}</span>}
        </a>
      ))}
    </div>
  );
}

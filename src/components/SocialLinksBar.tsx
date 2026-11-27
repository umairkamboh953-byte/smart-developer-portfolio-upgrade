import React from 'react';
import { PublicSettings } from '../types';

interface SocialLinksBarProps {
  socialLinks?: PublicSettings['socialLinks'];
  showLabels?: boolean;
  className?: string;
}

function normalizeSocialUrl(rawUrl: string | undefined, fallbackUrl: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return fallbackUrl;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

export const SocialLinksBar: React.FC<SocialLinksBarProps> = ({
  socialLinks = {},
  showLabels = false,
  className = ''
}) => {
  const platforms = [
    {
      key: 'tiktok' as const,
      label: 'TikTok',
      url: normalizeSocialUrl(socialLinks.tiktok, 'https://www.tiktok.com'),
      configured: Boolean(socialLinks.tiktok?.trim()),
      hoverClass: 'hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.8a4.83 4.83 0 0 1-1-.11z" />
        </svg>
      )
    },
    {
      key: 'instagram' as const,
      label: 'Instagram',
      url: normalizeSocialUrl(socialLinks.instagram, 'https://www.instagram.com'),
      configured: Boolean(socialLinks.instagram?.trim()),
      hoverClass: 'hover:border-pink-400/50 hover:bg-pink-500/10 hover:text-pink-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      )
    },
    {
      key: 'facebook' as const,
      label: 'Facebook',
      url: normalizeSocialUrl(socialLinks.facebook, 'https://www.facebook.com'),
      configured: Boolean(socialLinks.facebook?.trim()),
      hoverClass: 'hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      )
    },
    {
      key: 'youtube' as const,
      label: 'YouTube',
      url: normalizeSocialUrl(socialLinks.youtube, 'https://www.youtube.com'),
      configured: Boolean(socialLinks.youtube?.trim()),
      hoverClass: 'hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-300',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    }
  ];

  const extraPlatforms = [
    socialLinks.github?.trim()
      ? {
          key: 'github',
          label: 'GitHub',
          url: normalizeSocialUrl(socialLinks.github, 'https://github.com')
        }
      : null,
    socialLinks.linkedin?.trim()
      ? {
          key: 'linkedin',
          label: 'LinkedIn',
          url: normalizeSocialUrl(socialLinks.linkedin, 'https://www.linkedin.com')
        }
      : null,
    socialLinks.twitter?.trim()
      ? {
          key: 'twitter',
          label: 'X / Twitter',
          url: normalizeSocialUrl(socialLinks.twitter, 'https://x.com')
        }
      : null
  ].filter(Boolean) as { key: string; label: string; url: string }[];

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {platforms.map((platform) => (
        <a
          key={platform.key}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platform.label}
          title={platform.configured ? `${platform.label} — Elvora Vision` : platform.label}
          className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-200 ${
            showLabels ? 'px-3.5 py-2 text-xs font-medium' : 'px-3 py-2 text-xs font-medium'
          } ${platform.hoverClass}`}
        >
          {platform.icon}
          <span>{platform.label}</span>
        </a>
      ))}

      {extraPlatforms.map((extra) => (
        <a
          key={extra.key}
          href={extra.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-medium text-slate-300 hover:border-white/30 hover:text-white transition-all duration-200"
        >
          {extra.label}
        </a>
      ))}
    </div>
  );
};

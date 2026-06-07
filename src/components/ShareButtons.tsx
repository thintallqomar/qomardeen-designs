import { Twitter, Linkedin, Link2, Check, Mail, Facebook, Share2, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import IconTooltip from '@/components/IconTooltip';
import { trackShare } from '@/hooks/useVisitorTracking';

interface ShareButtonsProps {
  title: string;
  url?: string;
  articleSlug?: string;
}

const ShareButtons = ({ title, url, articleSlug }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const pagePath = typeof window !== 'undefined' ? window.location.pathname : '';

  const recordShare = (destination: string) => {
    trackShare(destination, pagePath, { articleSlug, title });
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    recordShare('copy_link');
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    { label: 'Twitter', Icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: 'LinkedIn', Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: 'Facebook', Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'WhatsApp', Icon: MessageCircle, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'Email', Icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%20-%20${encodedUrl}` },
  ];

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({ title, url: shareUrl });
        recordShare('native_share');
      } catch {
        /* user cancelled */
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-muted-foreground mr-1">Share</span>
      {links.map(({ label, Icon, href }) => (
        <IconTooltip key={label} label={`Share via ${label}`}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => recordShare(label.toLowerCase())}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Share via ${label}`}
          >
            <Icon className="w-4 h-4" />
          </a>
        </IconTooltip>
      ))}
      <IconTooltip label={copied ? 'Link copied' : 'Copy link'}>
        <button
          onClick={copyLink}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-primary" /> : <Link2 className="w-4 h-4" />}
        </button>
      </IconTooltip>
      {hasNativeShare && (
        <IconTooltip label="Open share menu">
          <button
            onClick={nativeShare}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors sm:hidden"
            aria-label="Open share menu"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </IconTooltip>
      )}
    </div>
  );
};

export default ShareButtons;

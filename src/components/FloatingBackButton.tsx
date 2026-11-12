import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

/**
 * "Back to Projects" pinned to the top-left of the screen. It is rendered straight into
 * <body>, so it stays visible however far down the page you are.
 */
const FloatingBackButton = ({ to = '/projects' }: { to?: string }) => {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();
  const label = t('caseStudy.back', { defaultValue: 'Back to Projects' });

  return createPortal(
    <button
      type="button"
      onClick={() => navigate(to)}
      aria-label={label}
      className="fixed top-20 left-3 sm:left-4 z-[60] inline-flex items-center gap-2 h-9 px-3 rounded-full border border-border bg-background/85 backdrop-blur-md shadow-md text-sm font-medium text-foreground hover:bg-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>,
    document.body,
  );
};

export default FloatingBackButton;

import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

/**
 * "Back to Projects" pinned to the top-left of the screen (bottom-left on phones, where the top-left would cover the story text). It is rendered straight into
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
      className="fixed bottom-5 left-4 sm:bottom-auto sm:top-20 z-[60] inline-flex items-center justify-center gap-2 h-11 w-11 sm:h-9 sm:w-auto sm:px-3 rounded-full border border-border bg-background/85 backdrop-blur-md shadow-md text-sm font-medium text-foreground hover:bg-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>,
    document.body,
  );
};

export default FloatingBackButton;

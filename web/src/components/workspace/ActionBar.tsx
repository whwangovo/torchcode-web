'use client';

import { Play, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassBar } from '@/components/ui/GlassBar';
import { useLocale } from '@/context/LocaleContext';

interface ActionBarProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ActionBar({ onSubmit, isSubmitting }: ActionBarProps) {
  const { t } = useLocale();
  return (
    <GlassBar className="px-4 py-2.5 flex items-center justify-end gap-3 border-t border-border/50">
      <Button
        variant="primary"
        size="sm"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : (
          <Send className="w-3.5 h-3.5 mr-1.5" />
        )}
        {isSubmitting ? t('judging') : t('submit')}
      </Button>
    </GlassBar>
  );
}

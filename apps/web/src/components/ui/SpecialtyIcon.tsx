import { cn } from '@/lib/utils';

const GLYPHS: Record<string, string> = {
  ear: '👂',
  sparkles: '✨',
  tooth: '🦷',
  heart: '❤️',
  eye: '👁️',
  bone: '🦴',
  skin: '🧴',
  female: '⚕️',
  scalpel: '🔬',
  brain: '🧠',
  ribbon: '🎗️',
  dna: '🧬',
};

export function SpecialtyIcon({
  icon,
  className,
}: {
  icon?: string;
  className?: string;
}) {
  const glyph = (icon && GLYPHS[icon]) || '⚕️';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-turquoise-50 text-2xl',
        className,
      )}
    >
      {glyph}
    </span>
  );
}

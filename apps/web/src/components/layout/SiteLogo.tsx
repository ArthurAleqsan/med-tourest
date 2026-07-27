import Image from 'next/image';
import { SITE_NAME } from '@/lib/config';
import { cn } from '@/lib/utils';

type LogoVariant = 'dark' | 'light';
type LogoSize = 'md' | 'lg';

const SIZE_CLASSES: Record<LogoSize, string> = {
  // Default for footer / admin
  md: 'h-14 w-14 sm:h-16 sm:w-16',
  // Header — 50% larger than md (84px / 96px)
  lg: 'h-[84px] w-[84px] sm:h-24 sm:w-24',
};

const SIZE_PX: Record<LogoSize, number> = {
  md: 64,
  lg: 96,
};

/**
 * Official med.tourest.online mark (medical cross + MED / TOUREST.ONLINE).
 * `dark` = transparent bg for light surfaces; `light` = white tile for dark surfaces.
 */
export function SiteLogo({
  variant = 'dark',
  size = 'md',
  className,
  priority = false,
}: {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}) {
  const src = variant === 'light' ? '/images/logo-light.svg' : '/images/logo.svg';
  const px = SIZE_PX[size];

  return (
    <span className={cn('inline-flex shrink-0 items-center', className)}>
      <Image
        src={src}
        alt={SITE_NAME}
        width={px}
        height={px}
        className={SIZE_CLASSES[size]}
        priority={priority}
        unoptimized
      />
    </span>
  );
}

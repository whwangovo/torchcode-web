'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code, Flame } from 'lucide-react';
import { GlassBar } from '@/components/ui/GlassBar';
import { cn } from '@/lib/utils';

interface TopNavProps {
  solvedCount?: number;
  totalCount?: number;
}

export function TopNav({ solvedCount, totalCount }: TopNavProps) {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/problems', label: 'Problems' },
  ];

  return (
    <GlassBar as="nav" className="px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-text-primary font-semibold text-lg tracking-tight">
          <Code className="w-5 h-5 text-accent" />
          TorchCode
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm transition-colors duration-200',
                pathname === link.href
                  ? 'text-accent font-medium bg-accent/5'
                  : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {solvedCount !== undefined && totalCount !== undefined && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Flame className="w-4 h-4 text-medium" />
          <span>{solvedCount}/{totalCount} solved</span>
        </div>
      )}
    </GlassBar>
  );
}

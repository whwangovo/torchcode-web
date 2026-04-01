# TorchCode Frontend Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the TorchCode web frontend with a LeetCode + Apple minimalist design using selective frosted glass effects.

**Architecture:** Next.js 14 App Router with 4 pages (Home, Problem List, Workspace, Solutions). Selective `backdrop-blur` on nav/action bars, clean white surfaces elsewhere. Reusable UI primitives via CVA, custom split-pane hook for the workspace, Radix Tabs/Dialog for interactive panels.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 3.4, Monaco Editor, Zustand, Radix UI, CVA, lucide-react, better-sqlite3

---

## File Structure

```
src/
  app/
    globals.css              — REWRITE: Apple design tokens + base styles
    layout.tsx               — MODIFY: add TopNav, update body classes
    page.tsx                 — REWRITE: Apple-style home page
    problems/
      page.tsx               — REWRITE: clean problem list page
      [id]/
        page.tsx             — REWRITE: split-pane workspace
    solutions/
      [id]/
        page.tsx             — REWRITE: two-column solution viewer
    api/                     — KEEP AS-IS (all routes unchanged)
  components/
    ui/
      GlassBar.tsx           — NEW: frosted glass container
      Badge.tsx              — NEW: CVA pill badges
      Button.tsx             — NEW: CVA button variants
      SplitPane.tsx          — NEW: resizable split pane
    layout/
      TopNav.tsx             — NEW: navigation bar
      ProblemDrawer.tsx      — NEW: slide-out problem sidebar
    problem/
      ProblemRow.tsx         — NEW: list item row
      ProblemFilters.tsx     — NEW: search + filter bar
      DifficultyBadge.tsx    — NEW: difficulty pill (wraps Badge)
      StatusIcon.tsx         — NEW: status indicator icon
    workspace/
      DescriptionTab.tsx     — NEW: problem description panel
      SolutionTab.tsx        — NEW: inline solution viewer
      CodeEditor.tsx         — NEW: Monaco light theme wrapper
      TestResults.tsx        — NEW: collapsible results panel
      ActionBar.tsx          — NEW: floating submit bar
    solution/
      SolutionPage.tsx       — NEW: full solution walkthrough
  lib/
    types.ts                 — KEEP AS-IS
    db.ts                    — KEEP AS-IS
    constants.ts             — KEEP AS-IS
    utils.ts                 — KEEP AS-IS
    parseNotebook.ts         — KEEP AS-IS
    problems.json            — KEEP AS-IS
    starters.json            — KEEP AS-IS
    monacoTheme.ts           — NEW: custom light theme definition
  store/
    problemStore.ts          — MODIFY: add drawer/tab state
```

---

## Task 1: Design Tokens & Global Styles

**Files:**
- Modify: `web/tailwind.config.ts`
- Rewrite: `web/src/app/globals.css`
- Modify: `web/src/app/layout.tsx`

- [ ] **Step 1: Update tailwind.config.ts with design tokens**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#007aff',
          hover: '#0062cc',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#fafafa',
        },
        border: '#e5e5e5',
        'text-primary': '#1d1d1f',
        'text-secondary': '#6e6e73',
        'text-tertiary': '#aeaeb2',
        easy: '#34c759',
        medium: '#ff9500',
        hard: '#ff3b30',
        solved: '#30b0c7',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.06)',
        'soft-lg': '0 4px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Rewrite globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-surface text-text-primary antialiased;
  }

  * {
    @apply border-border;
  }
}

@layer components {
  .glass {
    @apply bg-white/80 backdrop-blur-lg border-b border-border/50;
  }
}
```

- [ ] **Step 3: Update layout.tsx body classes**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TorchCode",
  description: "LeetCode for PyTorch — ML coding challenges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-surface`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds with no errors

- [ ] **Step 5: Commit**

```bash
git add web/tailwind.config.ts web/src/app/globals.css web/src/app/layout.tsx
git commit -m "feat(web): add Apple design tokens and global styles"
```

---

## Task 2: UI Primitives — GlassBar, Badge, Button

**Files:**
- Create: `web/src/components/ui/GlassBar.tsx`
- Create: `web/src/components/ui/Badge.tsx`
- Create: `web/src/components/ui/Button.tsx`

- [ ] **Step 1: Create GlassBar component**

```tsx
// web/src/components/ui/GlassBar.tsx
import { cn } from '@/lib/utils';

interface GlassBarProps {
  children: React.ReactNode;
  className?: string;
  as?: 'nav' | 'div' | 'footer';
}

export function GlassBar({ children, className, as: Tag = 'div' }: GlassBarProps) {
  return (
    <Tag className={cn('glass sticky top-0 z-50', className)}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Create Badge component with CVA**

```tsx
// web/src/components/ui/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        easy: 'bg-easy/10 text-easy',
        medium: 'bg-medium/10 text-medium',
        hard: 'bg-hard/10 text-hard',
        solved: 'bg-solved/10 text-solved',
        default: 'bg-gray-100 text-text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create Button component with CVA**

```tsx
// web/src/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white hover:bg-accent-hover',
        secondary: 'bg-gray-100 text-text-primary hover:bg-gray-200',
        ghost: 'text-text-secondary hover:bg-gray-100 hover:text-text-primary',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-11 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add web/src/components/ui/
git commit -m "feat(web): add GlassBar, Badge, Button UI primitives"
```

---

## Task 3: SplitPane Component

**Files:**
- Create: `web/src/components/ui/SplitPane.tsx`

- [ ] **Step 1: Create SplitPane with custom resize hook**

```tsx
// web/src/components/ui/SplitPane.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRatio?: number; // 0-1, default 0.5
  minLeft?: number;      // px
  minRight?: number;     // px
  className?: string;
}

export function SplitPane({
  left,
  right,
  defaultRatio = 0.5,
  minLeft = 320,
  minRight = 380,
  className,
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(defaultRatio);
  const dragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newRatio = Math.max(
        minLeft / rect.width,
        Math.min(1 - minRight / rect.width, x / rect.width)
      );
      setRatio(newRatio);
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [minLeft, minRight]);

  return (
    <div ref={containerRef} className={cn('flex h-full w-full', className)}>
      <div style={{ width: `${ratio * 100}%` }} className="overflow-auto">
        {left}
      </div>
      <div
        onMouseDown={onMouseDown}
        className="w-1 cursor-col-resize bg-border hover:bg-accent/30 transition-colors flex-shrink-0"
      />
      <div style={{ width: `${(1 - ratio) * 100}%` }} className="overflow-auto">
        {right}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add web/src/components/ui/SplitPane.tsx
git commit -m "feat(web): add resizable SplitPane component"
```

---

## Task 4: Monaco Light Theme

**Files:**
- Create: `web/src/lib/monacoTheme.ts`

- [ ] **Step 1: Create custom light theme definition**

```typescript
// web/src/lib/monacoTheme.ts
import type { editor } from 'monaco-editor';

export const appleLight: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: 'aeaeb2', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'af52de' },
    { token: 'string', foreground: '34c759' },
    { token: 'number', foreground: 'ff9500' },
    { token: 'type', foreground: '007aff' },
    { token: 'function', foreground: '007aff' },
    { token: 'variable', foreground: '1d1d1f' },
    { token: 'operator', foreground: '6e6e73' },
    { token: 'delimiter', foreground: '6e6e73' },
  ],
  colors: {
    'editor.background': '#fafafa',
    'editor.foreground': '#1d1d1f',
    'editor.lineHighlightBackground': '#f0f0f0',
    'editor.selectionBackground': '#007aff22',
    'editorLineNumber.foreground': '#c7c7cc',
    'editorLineNumber.activeForeground': '#6e6e73',
    'editor.inactiveSelectionBackground': '#007aff11',
    'editorIndentGuide.background': '#e5e5e5',
    'editorCursor.foreground': '#007aff',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add web/src/lib/monacoTheme.ts
git commit -m "feat(web): add Apple-style Monaco light theme"
```

---

## Task 5: Layout Components — TopNav & ProblemDrawer

**Files:**
- Create: `web/src/components/layout/TopNav.tsx`
- Create: `web/src/components/layout/ProblemDrawer.tsx`
- Modify: `web/src/store/problemStore.ts`

- [ ] **Step 1: Extend Zustand store with drawer state**

Replace `web/src/store/problemStore.ts` with:

```typescript
import { create } from 'zustand';

interface ProblemStore {
  currentCode: string;
  setCurrentCode: (code: string) => void;
  submissionResult: any | null;
  setSubmissionResult: (result: any | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  currentCode: '',
  setCurrentCode: (code) => set({ currentCode: code }),
  submissionResult: null,
  setSubmissionResult: (result) => set({ submissionResult: result }),
  isSubmitting: false,
  setIsSubmitting: (v) => set({ isSubmitting: v }),
  drawerOpen: false,
  setDrawerOpen: (v) => set({ drawerOpen: v }),
}));
```

- [ ] **Step 2: Create TopNav component**

```tsx
// web/src/components/layout/TopNav.tsx
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
```

- [ ] **Step 3: Create ProblemDrawer component**

```tsx
// web/src/components/layout/ProblemDrawer.tsx
'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Problem, ProgressMap } from '@/lib/types';

interface ProblemDrawerProps {
  open: boolean;
  onClose: () => void;
  problems: Problem[];
  progress: ProgressMap;
  currentId?: string;
}

export function ProblemDrawer({ open, onClose, problems, progress, currentId }: ProblemDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/20 z-40 transition-opacity duration-250',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={cn(
          'fixed left-0 top-0 bottom-0 w-80 bg-surface z-50 shadow-soft-lg',
          'transform transition-transform duration-250 ease-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-sm tracking-tight">Problems</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-57px)]">
          {problems.map((p) => {
            const status = progress[p.id]?.status || 'todo';
            return (
              <Link
                key={p.id}
                href={`/problems/${p.id}`}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  currentId === p.id
                    ? 'bg-accent/5 text-accent'
                    : 'text-text-primary hover:bg-gray-50'
                )}
              >
                <span className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  status === 'solved' && 'bg-solved',
                  status === 'attempted' && 'bg-medium',
                  status === 'todo' && 'bg-gray-300',
                )} />
                <span className="truncate flex-1">{p.title}</span>
                <Badge variant={p.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>
                  {p.difficulty}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add web/src/store/problemStore.ts web/src/components/layout/
git commit -m "feat(web): add TopNav and ProblemDrawer layout components"
```

---

## Task 6: Problem List Components

**Files:**
- Create: `web/src/components/problem/StatusIcon.tsx`
- Create: `web/src/components/problem/DifficultyBadge.tsx`
- Create: `web/src/components/problem/ProblemFilters.tsx`
- Create: `web/src/components/problem/ProblemRow.tsx`

- [ ] **Step 1: Create StatusIcon**

```tsx
// web/src/components/problem/StatusIcon.tsx
import { CheckCircle, Circle, Clock } from 'lucide-react';
import type { ProblemProgress } from '@/lib/types';

interface StatusIconProps {
  status: ProblemProgress['status'];
}

export function StatusIcon({ status }: StatusIconProps) {
  switch (status) {
    case 'solved':
      return <CheckCircle className="w-4 h-4 text-solved" />;
    case 'attempted':
      return <Clock className="w-4 h-4 text-medium" />;
    default:
      return <Circle className="w-4 h-4 text-gray-300" />;
  }
}
```

- [ ] **Step 2: Create DifficultyBadge**

```tsx
// web/src/components/problem/DifficultyBadge.tsx
import { Badge } from '@/components/ui/Badge';
import type { Problem } from '@/lib/types';

interface DifficultyBadgeProps {
  difficulty: Problem['difficulty'];
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const variant = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
  return <Badge variant={variant}>{difficulty}</Badge>;
}
```

- [ ] **Step 3: Create ProblemFilters**

```tsx
// web/src/components/problem/ProblemFilters.tsx
'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProblemFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  difficulty: string;
  onDifficultyChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
}

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const statuses = ['All', 'Todo', 'Attempted', 'Solved'];

export function ProblemFilters({
  search, onSearchChange,
  difficulty, onDifficultyChange,
  status, onStatusChange,
}: ProblemFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-secondary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
        />
      </div>
      <div className="flex items-center gap-1">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => onDifficultyChange(d === 'All' ? '' : d)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              (d === 'All' && !difficulty) || difficulty === d
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:bg-gray-100'
            )}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s === 'All' ? '' : s.toLowerCase())}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              (s === 'All' && !status) || status === s.toLowerCase()
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:bg-gray-100'
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create ProblemRow**

```tsx
// web/src/components/problem/ProblemRow.tsx
import Link from 'next/link';
import { StatusIcon } from './StatusIcon';
import { DifficultyBadge } from './DifficultyBadge';
import type { Problem, ProblemProgress } from '@/lib/types';

interface ProblemRowProps {
  problem: Problem;
  index: number;
  progress?: ProblemProgress;
}

export function ProblemRow({ problem, index, progress }: ProblemRowProps) {
  const status = progress?.status || 'todo';

  return (
    <Link
      href={`/problems/${problem.id}`}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-surface-secondary transition-colors duration-200 group"
    >
      <StatusIcon status={status} />
      <span className="text-sm text-text-tertiary w-8">{index + 1}</span>
      <span className="flex-1 text-sm text-text-primary group-hover:text-accent transition-colors">
        {problem.title}
      </span>
      <DifficultyBadge difficulty={problem.difficulty} />
    </Link>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add web/src/components/problem/
git commit -m "feat(web): add problem list components (StatusIcon, DifficultyBadge, ProblemFilters, ProblemRow)"
```

---

## Task 7: Workspace Components — CodeEditor, TestResults, ActionBar

**Files:**
- Create: `web/src/components/workspace/CodeEditor.tsx`
- Create: `web/src/components/workspace/TestResults.tsx`
- Create: `web/src/components/workspace/ActionBar.tsx`

- [ ] **Step 1: Create CodeEditor with Apple light theme**

```tsx
// web/src/components/workspace/CodeEditor.tsx
'use client';

import { useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { appleLight } from '@/lib/monacoTheme';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ value, onChange, readOnly = false, height = '100%' }: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.defineTheme('apple-light', appleLight);
    monaco.editor.setTheme('apple-light');
  };

  return (
    <Editor
      height={height}
      language="python"
      value={value}
      onChange={(v) => onChange(v || '')}
      onMount={handleMount}
      options={{
        readOnly,
        fontSize: 14,
        lineHeight: 22,
        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: 'line',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        bracketPairColorization: { enabled: true },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  );
}
```

- [ ] **Step 2: Create TestResults component**

```tsx
// web/src/components/workspace/TestResults.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SubmissionResult } from '@/lib/types';

interface TestResultsProps {
  result: SubmissionResult | null;
}

export function TestResults({ result }: TestResultsProps) {
  const [expanded, setExpanded] = useState(true);

  if (!result) return null;

  return (
    <div className="border-t border-border bg-surface">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium hover:bg-surface-secondary transition-colors"
      >
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <span className={result.allPassed ? 'text-easy' : 'text-hard'}>
          {result.allPassed ? 'All Passed' : `${result.passed}/${result.total} Passed`}
        </span>
        <span className="text-text-tertiary text-xs ml-auto">{result.totalTimeMs.toFixed(0)}ms</span>
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-1">
          {result.results.map((r, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 text-sm">
              {r.passed
                ? <CheckCircle className="w-3.5 h-3.5 text-easy flex-shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-hard flex-shrink-0" />}
              <span className="text-text-primary">{r.name}</span>
              <span className="text-text-tertiary text-xs ml-auto">{r.execTimeMs.toFixed(1)}ms</span>
            </div>
          ))}
          {result.error && (
            <pre className="mt-2 p-3 rounded-lg bg-hard/5 text-hard text-xs overflow-x-auto">
              {result.error}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create ActionBar component**

```tsx
// web/src/components/workspace/ActionBar.tsx
'use client';

import { Play, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassBar } from '@/components/ui/GlassBar';

interface ActionBarProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ActionBar({ onSubmit, isSubmitting }: ActionBarProps) {
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
        {isSubmitting ? 'Judging...' : 'Submit'}
      </Button>
    </GlassBar>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add web/src/components/workspace/CodeEditor.tsx web/src/components/workspace/TestResults.tsx web/src/components/workspace/ActionBar.tsx
git commit -m "feat(web): add workspace components (CodeEditor, TestResults, ActionBar)"
```

---

## Task 8: Workspace Components — DescriptionTab & SolutionTab

**Files:**
- Create: `web/src/components/workspace/DescriptionTab.tsx`
- Create: `web/src/components/workspace/SolutionTab.tsx`

- [ ] **Step 1: Create DescriptionTab**

```tsx
// web/src/components/workspace/DescriptionTab.tsx
'use client';

import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import { DifficultyBadge } from '@/components/problem/DifficultyBadge';
import { cn } from '@/lib/utils';
import type { Problem } from '@/lib/types';

interface DescriptionTabProps {
  problem: Problem;
  hasAttempted: boolean;
}

export function DescriptionTab({ problem, hasAttempted }: DescriptionTabProps) {
  const [hintOpen, setHintOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {problem.title}
          </h1>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <p className="text-sm text-text-secondary">
          Implement the <code className="px-1.5 py-0.5 rounded bg-surface-secondary text-accent text-xs font-mono">{problem.functionName}</code> function.
        </p>
      </div>

      {/* Test examples */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-primary">Test Cases</h3>
        {problem.tests.slice(0, 2).map((test, i) => (
          <div key={i} className="p-3 rounded-lg bg-surface-secondary border border-border/50">
            <p className="text-xs font-medium text-text-secondary mb-1">{test.name}</p>
          </div>
        ))}
        {problem.tests.length > 2 && (
          <p className="text-xs text-text-tertiary">+ {problem.tests.length - 2} more tests</p>
        )}
      </div>

      {/* Hint */}
      {hasAttempted && problem.hint && (
        <div>
          <button
            onClick={() => setHintOpen(!hintOpen)}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Hint</span>
            {hintOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          {hintOpen && (
            <p className="mt-2 p-3 rounded-lg bg-medium/5 text-sm text-text-secondary leading-relaxed">
              {problem.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create SolutionTab**

```tsx
// web/src/components/workspace/SolutionTab.tsx
'use client';

import { useEffect, useState } from 'react';
import { CodeEditor } from './CodeEditor';

interface SolutionTabProps {
  problemId: string;
}

export function SolutionTab({ problemId }: SolutionTabProps) {
  const [cells, setCells] = useState<{ type: string; source: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/solutions/${problemId}`)
      .then((r) => r.json())
      .then((data) => setCells(data.cells || []))
      .catch(() => setCells([]))
      .finally(() => setLoading(false));
  }, [problemId]);

  if (loading) {
    return <div className="p-6 text-sm text-text-tertiary">Loading solution...</div>;
  }

  if (cells.length === 0) {
    return <div className="p-6 text-sm text-text-tertiary">No solution available yet.</div>;
  }

  const code = cells
    .filter((c) => c.type === 'code')
    .map((c) => c.source)
    .join('\n\n');

  return (
    <div className="h-full">
      <CodeEditor value={code} onChange={() => {}} readOnly />
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add web/src/components/workspace/DescriptionTab.tsx web/src/components/workspace/SolutionTab.tsx
git commit -m "feat(web): add DescriptionTab and SolutionTab workspace components"
```

---

## Task 9: Home Page

**Files:**
- Rewrite: `web/src/app/page.tsx`

- [ ] **Step 1: Rewrite home page**

```tsx
// web/src/app/page.tsx
import Link from 'next/link';
import { ArrowRight, Code, Zap, Trophy } from 'lucide-react';
import { TopNav } from '@/components/layout/TopNav';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

async function getStats() {
  const res = await fetch('http://localhost:3000/api/problems', { cache: 'no-store' });
  const data = await res.json();
  const total = data.total;
  const easy = data.problems.filter((p: any) => p.difficulty === 'Easy').length;
  const medium = data.problems.filter((p: any) => p.difficulty === 'Medium').length;
  const hard = data.problems.filter((p: any) => p.difficulty === 'Hard').length;
  return { total, easy, medium, hard };
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <main className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-accent/5 text-accent text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            {stats.total} PyTorch challenges
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-4">
            Master PyTorch,<br />one problem at a time.
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
            Implement core operations from scratch — softmax, attention, GPT blocks and more. Instant feedback, real tests.
          </p>
          <Link href="/problems">
            <Button size="lg">
              Start Practicing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4 pb-24">
          {[
            { label: 'Easy', count: stats.easy, color: 'text-easy', bg: 'bg-easy/5' },
            { label: 'Medium', count: stats.medium, color: 'text-medium', bg: 'bg-medium/5' },
            { label: 'Hard', count: stats.hard, color: 'text-hard', bg: 'bg-hard/5' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-6 text-center`}>
              <p className={`text-3xl font-bold tracking-tight ${s.color}`}>{s.count}</p>
              <p className="text-sm text-text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add web/src/app/page.tsx
git commit -m "feat(web): rewrite home page with Apple minimal design"
```

---

## Task 10: Problem List Page

**Files:**
- Rewrite: `web/src/app/problems/page.tsx`

- [ ] **Step 1: Rewrite problem list page**

```tsx
// web/src/app/problems/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { ProblemFilters } from '@/components/problem/ProblemFilters';
import { ProblemRow } from '@/components/problem/ProblemRow';
import type { Problem, ProgressMap } from '@/lib/types';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/problems')
      .then((r) => r.json())
      .then((d) => setProblems(d.problems));
    fetch('/api/progress')
      .then((r) => r.json())
      .then((d) => setProgress(d.progress || {}));
  }, []);

  const solvedCount = Object.values(progress).filter((p) => p.status === 'solved').length;

  const filtered = problems.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (difficulty && p.difficulty !== difficulty) return false;
    if (status) {
      const ps = progress[p.id]?.status || 'todo';
      if (ps !== status) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-surface">
      <TopNav solvedCount={solvedCount} totalCount={problems.length} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-6">Problems</h1>
        <ProblemFilters
          search={search}
          onSearchChange={setSearch}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          status={status}
          onStatusChange={setStatus}
        />
        <div className="space-y-1">
          {filtered.map((p, i) => (
            <ProblemRow
              key={p.id}
              problem={p}
              index={i}
              progress={progress[p.id]}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-text-tertiary text-center py-12">No problems match your filters.</p>
          )}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add web/src/app/problems/page.tsx
git commit -m "feat(web): rewrite problem list page with filters and Apple styling"
```

---

## Task 11: Workspace Page (Problem Detail)

**Files:**
- Rewrite: `web/src/app/problems/[id]/page.tsx`

- [ ] **Step 1: Rewrite workspace page**

```tsx
// web/src/app/problems/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
import { Menu } from 'lucide-react';
import { SplitPane } from '@/components/ui/SplitPane';
import { TopNav } from '@/components/layout/TopNav';
import { ProblemDrawer } from '@/components/layout/ProblemDrawer';
import { DescriptionTab } from '@/components/workspace/DescriptionTab';
import { SolutionTab } from '@/components/workspace/SolutionTab';
import { CodeEditor } from '@/components/workspace/CodeEditor';
import { TestResults } from '@/components/workspace/TestResults';
import { ActionBar } from '@/components/workspace/ActionBar';
import { useProblemStore } from '@/store/problemStore';
import { cn } from '@/lib/utils';
import type { Problem, ProgressMap, SubmissionResult } from '@/lib/types';

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const {
    currentCode, setCurrentCode,
    submissionResult, setSubmissionResult,
    isSubmitting, setIsSubmitting,
    drawerOpen, setDrawerOpen,
  } = useProblemStore();

  const [problem, setProblem] = useState<(Problem & { starterCode?: string }) | null>(null);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    fetch(`/api/problems/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProblem(data);
        setCurrentCode(data.starterCode || '');
        setSubmissionResult(null);
      });
    fetch('/api/problems')
      .then((r) => r.json())
      .then((d) => setAllProblems(d.problems));
    fetch('/api/progress')
      .then((r) => r.json())
      .then((d) => setProgress(d.progress || {}));
  }, [id, setCurrentCode, setSubmissionResult]);

  const handleSubmit = async () => {
    if (!problem || isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionResult(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: problem.id, code: currentCode }),
      });
      const result: SubmissionResult = await res.json();
      setSubmissionResult(result);
      // Refresh progress
      const progRes = await fetch('/api/progress');
      const progData = await progRes.json();
      setProgress(progData.progress || {});
    } catch (e) {
      setSubmissionResult({ passed: 0, total: 0, allPassed: false, results: [], totalTimeMs: 0, error: 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-sm text-text-tertiary">Loading...</p>
      </div>
    );
  }

  const hasAttempted = (progress[problem.id]?.attempts || 0) > 0 || submissionResult !== null;

  const leftPanel = (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-4 h-4 text-text-secondary" />
        </button>
        <span className="text-sm font-medium text-text-primary truncate">{problem.title}</span>
      </div>
      <Tabs.Root defaultValue="description" className="flex-1 flex flex-col overflow-hidden">
        <Tabs.List className="flex border-b border-border px-4">
          <Tabs.Trigger
            value="description"
            className="px-3 py-2 text-sm data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=inactive]:text-text-secondary hover:text-text-primary transition-colors -mb-px"
          >
            Description
          </Tabs.Trigger>
          <Tabs.Trigger
            value="solution"
            className="px-3 py-2 text-sm data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=inactive]:text-text-secondary hover:text-text-primary transition-colors -mb-px"
          >
            Solution
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="description" className="flex-1 overflow-auto">
          <DescriptionTab problem={problem} hasAttempted={hasAttempted} />
        </Tabs.Content>
        <Tabs.Content value="solution" className="flex-1 overflow-auto">
          <SolutionTab problemId={problem.id} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );

  const rightPanel = (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <CodeEditor value={currentCode} onChange={setCurrentCode} />
      </div>
      <TestResults result={submissionResult} />
      <ActionBar onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-surface">
      <TopNav />
      <div className="flex-1 overflow-hidden">
        <SplitPane left={leftPanel} right={rightPanel} />
      </div>
      <ProblemDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        problems={allProblems}
        progress={progress}
        currentId={id}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add web/src/app/problems/[id]/page.tsx
git commit -m "feat(web): rewrite workspace page with split-pane, tabs, and drawer"
```

---

## Task 12: Solutions Page

**Files:**
- Rewrite: `web/src/app/solutions/[id]/page.tsx`
- Create: `web/src/components/solution/SolutionPage.tsx`

- [ ] **Step 1: Create SolutionPage component**

```tsx
// web/src/components/solution/SolutionPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { CodeEditor } from '@/components/workspace/CodeEditor';

interface SolutionPageProps {
  problemId: string;
}

interface Cell {
  type: 'code' | 'markdown';
  source: string;
}

export function SolutionPageContent({ problemId }: SolutionPageProps) {
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/solutions/${problemId}`)
      .then((r) => r.json())
      .then((data) => setCells(data.cells || []))
      .catch(() => setCells([]))
      .finally(() => setLoading(false));
  }, [problemId]);

  if (loading) {
    return <p className="text-sm text-text-tertiary p-6">Loading solution...</p>;
  }

  if (cells.length === 0) {
    return <p className="text-sm text-text-tertiary p-6">No solution available yet.</p>;
  }

  const codeCells = cells.filter((c) => c.type === 'code');
  const markdownCells = cells.filter((c) => c.type === 'markdown');
  const code = codeCells.map((c) => c.source).join('\n\n');

  return (
    <div className="grid grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
      <div className="rounded-xl border border-border overflow-hidden">
        <CodeEditor value={code} onChange={() => {}} readOnly />
      </div>
      <div className="overflow-auto space-y-4">
        {markdownCells.map((cell, i) => (
          <div key={i} className="p-4 rounded-xl bg-surface-secondary border border-border/50">
            <pre className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
              {cell.source}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite solutions page**

```tsx
// web/src/app/solutions/[id]/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TopNav } from '@/components/layout/TopNav';
import { SolutionPageContent } from '@/components/solution/SolutionPage';

export default async function SolutionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <main className="max-w-6xl mx-auto px-6 py-6">
        <Link
          href={`/problems/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to problem
        </Link>
        <SolutionPageContent problemId={id} />
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add web/src/components/solution/SolutionPage.tsx web/src/app/solutions/[id]/page.tsx
git commit -m "feat(web): rewrite solutions page with two-column layout"
```

---

## Task 13: Cleanup — Remove Old Components

**Files:**
- Delete: `web/src/components/CodeEditor.tsx`
- Delete: `web/src/components/HintPanel.tsx`
- Delete: `web/src/components/Navigation.tsx`
- Delete: `web/src/components/ProblemDetailNav.tsx`
- Delete: `web/src/components/ProblemList.tsx`
- Delete: `web/src/components/ProblemListItem.tsx`
- Delete: `web/src/components/SubmissionResults.tsx`

- [ ] **Step 1: Delete all old components**

```bash
rm web/src/components/CodeEditor.tsx \
   web/src/components/HintPanel.tsx \
   web/src/components/Navigation.tsx \
   web/src/components/ProblemDetailNav.tsx \
   web/src/components/ProblemList.tsx \
   web/src/components/ProblemListItem.tsx \
   web/src/components/SubmissionResults.tsx
```

- [ ] **Step 2: Verify build**

Run: `cd web && npx next build`
Expected: Build succeeds with no missing import errors

- [ ] **Step 3: Commit**

```bash
git add -u web/src/components/
git commit -m "chore(web): remove old minimax components"
```

---

## Task 14: Final Verification

- [ ] **Step 1: Full build check**

Run: `cd web && npx next build`
Expected: Build succeeds with zero errors

- [ ] **Step 2: Manual smoke test**

Run `npm run dev` in the `web/` directory and verify:
1. Home page: hero section renders, stats cards show correct counts, nav bar has frosted glass effect
2. Problem list: search and filter work, difficulty badges colored correctly, status icons show
3. Workspace: split pane resizable, Monaco editor loads with light theme, submit sends to grading service, test results expand/collapse
4. Solutions: two-column layout renders code and markdown cells
5. Problem drawer: opens from hamburger icon, lists all problems, highlights current

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat(web): complete TorchCode frontend redesign — Apple minimal style"
```

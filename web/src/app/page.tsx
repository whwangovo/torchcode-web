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

import { TopNav } from '@/components/layout/TopNav';
import { HomeContent } from '@/components/home/HomeContent';

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
      <HomeContent stats={stats} />
    </div>
  );
}

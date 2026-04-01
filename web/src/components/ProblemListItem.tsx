"use client";

import Link from "next/link";
import { CheckCircle, Clock, Circle } from "lucide-react";
import { Problem, ProblemProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProblemListItemProps {
  problem: Problem;
  index: number;
  progress?: ProblemProgress;
}

const difficultyStyles = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusIcons = {
  solved: CheckCircle,
  attempted: Clock,
  todo: Circle,
};

const statusStyles = {
  solved: "text-green-600",
  attempted: "text-yellow-500",
  todo: "text-gray-400",
};

export function ProblemListItem({ problem, index, progress }: ProblemListItemProps) {
  const status = progress?.status ?? "todo";
  const StatusIcon = statusIcons[status];
  const difficulty = problem.difficulty.toLowerCase() as "easy" | "medium" | "hard";

  return (
    <Link
      href={`/problems/${problem.id}`}
      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors"
    >
      <StatusIcon className={cn("w-5 h-5 flex-shrink-0", statusStyles[status])} />

      <span className="w-12 text-sm text-gray-500 dark:text-gray-400">{index + 1}</span>

      <span className="flex-1 font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
        {problem.title}
      </span>

      <span
        className={cn(
          "px-2.5 py-0.5 rounded text-xs font-medium",
          difficultyStyles[difficulty]
        )}
      >
        {problem.difficulty}
      </span>
    </Link>
  );
}

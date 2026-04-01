"use client";

import Link from "next/link";
import { Code2, CheckCircle } from "lucide-react";
import { ProgressMap } from "@/lib/types";

interface NavigationProps {
  progress?: ProgressMap;
  totalProblems?: number;
}

export function Navigation({ progress, totalProblems = 0 }: NavigationProps) {
  const solvedCount = progress
    ? Object.values(progress).filter((p) => p.status === "solved").length
    : 0;

  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Code2 className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">TorchCode</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/problems"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Problems
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">{solvedCount}</span>
              <span className="mx-1">/</span>
              <span>{totalProblems}</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">Solved</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

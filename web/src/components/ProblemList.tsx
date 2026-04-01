"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Problem, ProgressMap } from "@/lib/types";
import { ProblemListItem } from "./ProblemListItem";

interface ProblemListProps {
  problems: Problem[];
  progress?: ProgressMap;
}

type DifficultyFilter = "all" | "easy" | "medium" | "hard";
type StatusFilter = "all" | "solved" | "attempted" | "todo";

export function ProblemList({ problems, progress }: ProblemListProps) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        search === "" ||
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.id.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === "all" ||
        problem.difficulty.toLowerCase() === difficultyFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (progress?.[problem.id]?.status ?? "todo") === statusFilter;

      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [problems, progress, search, difficultyFilter, statusFilter]);

  const groupedProblems = useMemo(() => {
    const groups: Record<string, Problem[]> = {
      easy: [],
      medium: [],
      hard: [],
    };

    filteredProblems.forEach((problem) => {
      const difficulty = problem.difficulty.toLowerCase() as "easy" | "medium" | "hard";
      groups[difficulty].push(problem);
    });

    return groups;
  }, [filteredProblems]);

  const difficultyLabels: Record<string, string> = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  const difficultyOrder = ["easy", "medium", "hard"];

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="solved">Solved</option>
            <option value="attempted">Attempted</option>
            <option value="todo">Todo</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {difficultyOrder.map((difficulty) => {
          const problemsInGroup = groupedProblems[difficulty];
          if (problemsInGroup.length === 0) return null;

          return (
            <div key={difficulty}>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {difficultyLabels[difficulty]}
                  <span className="ml-2 text-gray-400 dark:text-gray-500">
                    {problemsInGroup.length}
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {problemsInGroup.map((problem, idx) => {
                  const globalIndex = problems.findIndex((p) => p.id === problem.id);
                  return (
                    <ProblemListItem
                      key={problem.id}
                      problem={problem}
                      index={globalIndex}
                      progress={progress?.[problem.id]}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredProblems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No problems found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

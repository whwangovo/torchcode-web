import { create } from 'zustand';

interface ProblemStore {
  currentCode: string;
  setCurrentCode: (code: string) => void;
  submissionResult: any | null;
  setSubmissionResult: (result: any | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  currentCode: '',
  setCurrentCode: (code) => set({ currentCode: code }),
  submissionResult: null,
  setSubmissionResult: (result) => set({ submissionResult: result }),
  isSubmitting: false,
  setIsSubmitting: (v) => set({ isSubmitting: v }),
}));

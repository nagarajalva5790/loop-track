import { create } from 'zustand';
import { Issue, IssueStatus } from './types';
import { mockFetchIssues, mockUpdateIssue } from './utils/api';
import dayjs from 'dayjs';

interface StoreState {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  lastSync: string | null;
  recentlyAccessed: Issue[];
  fetchIssues: () => Promise<void>;
  moveIssue: (id: string, status: IssueStatus) => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
  addRecentlyAccessed: (issue: Issue) => void;
  setIssues: (issues: Issue[]) => void;
  setLastSync: (date: string) => void;
}

export const useStore = create<StoreState>((set: any, get: any) => ({
  issues: [],
  loading: false,
  error: null,
  lastSync: null,
  recentlyAccessed: JSON.parse(localStorage.getItem('recentlyAccessed') || '[]'),
  fetchIssues: async () => {
    set({ loading: true, error: null });
    try {
      const issues = await mockFetchIssues() as Issue[];
      set({ issues, loading: false, lastSync: dayjs().format('HH:mm:ss') });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  moveIssue: async (id: string, status: IssueStatus) => {
    const { issues } = get();
    const idx = issues.findIndex((i: Issue) => i.id === id);
    if (idx === -1) return;
    const updated = { ...issues[idx], status };
    set({ issues: issues.map((i: Issue) => i.id === id ? updated : i) });
    try {
      await mockUpdateIssue(id, { status });
    } catch (e) {
      set({ issues });
      set({ error: 'Failed to update issue' });
    }
  },
  updateIssue: async (id: string, updates: Partial<Issue>) => {
    const { issues } = get();
    const idx = issues.findIndex((i: Issue) => i.id === id);
    if (idx === -1) return;
    const updated = { ...issues[idx], ...updates };
    set({ issues: issues.map((i: Issue) => i.id === id ? updated : i) });
    try {
      await mockUpdateIssue(id, updates);
    } catch (e) {
      set({ issues });
      set({ error: 'Failed to update issue' });
    }
  },
  addRecentlyAccessed: (issue: Issue) => {
    let recent = get().recentlyAccessed.filter((i: Issue) => i.id !== issue.id);
    recent.unshift(issue);
    if (recent.length > 5) recent = recent.slice(0, 5);
    localStorage.setItem('recentlyAccessed', JSON.stringify(recent));
    set({ recentlyAccessed: recent });
  },
  setIssues: (issues: Issue[]) => set({ issues }),
  setLastSync: (date: string) => set({ lastSync: date }),
}));

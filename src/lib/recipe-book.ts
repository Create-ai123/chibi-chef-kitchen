import { useCallback, useEffect, useState } from "react";

export type SavedRecipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  time: number;
  method: string;
  difficulty: string;
  image?: string;
  savedAt: number;
  favorite: boolean;
  notes: string;
};

const KEY = "cozy-pantry-recipe-book";

function read(): SavedRecipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SavedRecipe[]) : [];
  } catch {
    return [];
  }
}

function write(list: SavedRecipe[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

export const recipeKey = (title: string, steps: string[]) =>
  `${title.trim().toLowerCase()}::${steps.length}`;

export function useRecipeBook() {
  const [book, setBook] = useState<SavedRecipe[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBook(read());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: SavedRecipe[]) => {
    setBook(next);
    write(next);
  }, []);

  const isSaved = useCallback(
    (title: string, steps: string[]) =>
      book.some((r) => recipeKey(r.title, r.steps) === recipeKey(title, steps)),
    [book],
  );

  const save = useCallback(
    (entry: Omit<SavedRecipe, "id" | "savedAt" | "favorite" | "notes">) => {
      const current = read();
      const key = recipeKey(entry.title, entry.steps);
      if (current.some((r) => recipeKey(r.title, r.steps) === key)) {
        persist(current);
        return false;
      }
      const next: SavedRecipe[] = [
        {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          savedAt: Date.now(),
          favorite: false,
          notes: "",
        },
        ...current,
      ];
      persist(next);
      return true;
    },
    [persist],
  );

  const update = useCallback(
    (id: string, patch: Partial<Pick<SavedRecipe, "title" | "notes" | "favorite">>) => {
      persist(read().map((r) => (r.id === id ? { ...r, ...patch } : r)));
    },
    [persist],
  );

  const remove = useCallback(
    (id: string) => {
      persist(read().filter((r) => r.id !== id));
    },
    [persist],
  );

  return { book, hydrated, isSaved, save, update, remove };
}

import { useState } from "react";
import type { SavedRecipe } from "@/lib/recipe-book";

type Props = {
  book: SavedRecipe[];
  mascotUrl: string;
  onUpdate: (id: string, patch: Partial<Pick<SavedRecipe, "title" | "notes" | "favorite">>) => void;
  onRemove: (id: string) => void;
  onToast: (msg: string) => void;
  onBack?: () => void;
};

export function RecipeBook({ book, mascotUrl, onUpdate, onRemove, onToast, onBack }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [popId, setPopId] = useState<string | null>(null);

  const startEdit = (r: SavedRecipe) => {
    setEditId(r.id);
    setDraftTitle(r.title);
    setDraftNotes(r.notes);
  };

  const saveEdit = (id: string) => {
    onUpdate(id, { title: draftTitle.trim() || "Untitled recipe", notes: draftNotes });
    setEditId(null);
    onToast("Recipe updated! ✨");
  };

  const toggleFav = (r: SavedRecipe) => {
    onUpdate(r.id, { favorite: !r.favorite });
    setPopId(r.id);
    setTimeout(() => setPopId(null), 420);
  };

  return (
    <section
      id="recipe-book"
      className="animate-fade-in rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={mascotUrl}
            alt=""
            width={768}
            height={768}
            loading="lazy"
            decoding="async"
            className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16"
          />
          <div>
            <h2 className="font-fredoka text-lg font-bold">My Recipe Book 📖✨</h2>
            <p className="text-xs text-muted-foreground">
              {book.length} saved {book.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-full bg-muted px-3 py-2 font-fredoka text-xs font-bold transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            ← Back to Pantry
          </button>
        )}
      </div>

      {book.length === 0 ? (
        <div className="mt-5 rounded-3xl border-2 border-dashed border-border bg-muted/60 p-6 text-center">
          <p className="font-fredoka text-sm font-bold">Your recipe book is waiting! 🍳</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Save a recipe and it&apos;ll appear here.
          </p>
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {book.map((r) => (
            <li
              key={r.id}
              className="animate-scale-in flex flex-col rounded-3xl border border-border bg-recipe p-4 shadow-[var(--shadow-soft)] transition-transform duration-200 hover:scale-[1.02]"
            >
              {r.image && (
                <img
                  src={r.image}
                  alt=""
                  loading="lazy"
                  className="mb-3 h-28 w-full rounded-2xl object-contain"
                />
              )}

              {editId === r.id ? (
                <div className="space-y-2">
                  <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    aria-label="Recipe title"
                    className="w-full rounded-full border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <textarea
                    value={draftNotes}
                    onChange={(e) => setDraftNotes(e.target.value)}
                    aria-label="Personal notes"
                    rows={3}
                    placeholder="Personal notes… e.g. add extra cheese"
                    className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(r.id)}
                      className="rounded-full bg-primary px-4 py-2 font-fredoka text-xs font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                    >
                      Save changes 💛
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="rounded-full bg-muted px-4 py-2 font-fredoka text-xs font-bold transition-transform hover:scale-105 active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-fredoka text-base font-extrabold">{r.title}</h3>
                    <button
                      type="button"
                      onClick={() => toggleFav(r)}
                      aria-pressed={r.favorite}
                      aria-label={r.favorite ? "Unfavorite recipe" : "Favorite recipe"}
                      className={`shrink-0 text-xl leading-none ${popId === r.id ? "animate-heart-pop" : ""}`}
                    >
                      {r.favorite ? "💖" : "🤍"}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent px-3 py-1 font-fredoka text-[11px] font-bold text-accent-foreground">
                      ⏱️ {r.time} min
                    </span>
                    <span className="rounded-full bg-mint px-3 py-1 font-fredoka text-[11px] font-bold text-secondary-foreground">
                      🍳 {r.method}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 font-fredoka text-[11px] font-bold">
                      🟢 {r.difficulty}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 font-fredoka text-[11px] font-bold">
                      {r.favorite ? "💖 Favorite" : "🤍 Not favorite"}
                    </span>
                  </div>

                  {r.notes && (
                    <p className="mt-3 rounded-2xl bg-card px-3 py-2 text-xs">
                      <span className="font-bold">Notes: </span>
                      {r.notes}
                    </p>
                  )}

                  {openId === r.id && (
                    <div className="animate-fade-in mt-3 rounded-2xl bg-card px-3 py-3 text-sm">
                      <p className="font-fredoka text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Ingredients
                      </p>
                      <ul className="mt-1 list-inside list-disc space-y-1 text-xs">
                        {r.ingredients.map((ing) => (
                          <li key={ing}>{ing}</li>
                        ))}
                      </ul>
                      <p className="mt-3 font-fredoka text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Steps
                      </p>
                      <ol className="mt-1 list-inside list-decimal space-y-1 text-xs">
                        {r.steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                      <p className="mt-3 text-[11px] text-muted-foreground">
                        Saved {new Date(r.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === r.id ? null : r.id)}
                      className="rounded-full bg-primary px-4 py-2 font-fredoka text-xs font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                    >
                      {openId === r.id ? "Hide Recipe" : "View Recipe"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(r)}
                      className="rounded-full bg-muted px-4 py-2 font-fredoka text-xs font-bold transition-transform hover:scale-105 active:scale-95"
                    >
                      Edit ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(r.id)}
                      className="rounded-full bg-muted px-4 py-2 font-fredoka text-xs font-bold transition-transform hover:scale-105 active:scale-95"
                    >
                      Delete 🗑️
                    </button>
                  </div>

                  {confirmId === r.id && (
                    <div className="animate-scale-in mt-3 rounded-2xl border-2 border-dashed border-secondary bg-card p-3 text-center">
                      <p className="text-sm font-semibold">
                        Remove this recipe from your cookbook? 🥺
                      </p>
                      <div className="mt-3 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="rounded-full bg-mint px-4 py-2 font-fredoka text-xs font-bold text-secondary-foreground transition-transform hover:scale-105 active:scale-95"
                        >
                          Keep it 💛
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onRemove(r.id);
                            setConfirmId(null);
                            onToast("Recipe removed 🗑️");
                          }}
                          className="rounded-full bg-primary px-4 py-2 font-fredoka text-xs font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                        >
                          Remove 🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
const chefMascot = "/mascot1.png";
const chefFull = "/chibi-chef.png";
import { RecipeBook } from "@/components/RecipeBook";
import { useRecipeBook } from "@/lib/recipe-book";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cozy Pantry Recipe Companion | Quick Pantry Snacks" },
      {
        name: "description",
        content:
          "Pick what's in your pantry and let the cozy chef whip up a quick stovetop or microwave snack in minutes.",
      },
      { property: "og:title", content: "Cozy Pantry Recipe Companion" },
      {
        property: "og:description",
        content:
          "A cute pantry-to-recipe helper: choose ingredients, set your time, and cook magic with the cozy chef.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PANTRY = [
  { name: "Oats", symbol: "🥣" },
  { name: "Milk", symbol: "🥛" },
  { name: "Flour", symbol: "🌾" },
  { name: "Eggs", symbol: "🥚" },
  { name: "Tomatoes", symbol: "🍅" },
  { name: "Chocolate Syrup", symbol: "🍫" },
  { name: "Bananas", symbol: "🍌" },
  { name: "Bread", symbol: "🍞" },
  { name: "Rice", symbol: "🍚" },
  { name: "Cheese", symbol: "🧀" },
];

const symbolFor = (name: string) =>
  PANTRY.find((p) => p.name === name)?.symbol ?? "🥄";

const TIME_FILTERS = [
  { id: "quick", label: "⚡ Under 5 mins", min: 0, max: 5 },
  { id: "mid", label: "⏳ 10-15 mins", min: 6, max: 15 },
  { id: "long", label: "🍳 20+ mins", min: 16, max: 999 },
] as const;

type FilterId = (typeof TIME_FILTERS)[number]["id"];

type Recipe = {
  title: string;
  time: number;
  method: string;
  ingredients: string[];
  steps: string[];
  tip: string;
};

const RECIPES: (Recipe & { keys: string[] })[] = [
  {
    keys: ["oats", "milk"],
    title: "Chocolate Oat Mug Cake 🍫",
    time: 5,
    method: "Microwave",
    ingredients: ["4 tbsp oats", "5 tbsp milk", "1 tbsp chocolate syrup", "Pinch of salt"],
    steps: [
      "Blitz or crush the oats a little so they soften faster.",
      "Stir oats, milk, syrup and salt in a big mug.",
      "Microwave 90 seconds, stir, then 30 seconds more.",
      "Let it rest a minute, drizzle extra syrup and dig in!",
    ],
    tip: "Use a mug twice the size of your batter so it never bubbles over!",
  },
  {
    keys: ["rice", "eggs"],
    title: "Speedy Egg Fried Rice 🍚",
    time: 10,
    method: "Stovetop",
    ingredients: ["1.5 cups cooked rice", "2 eggs", "1 tbsp oil", "Salt & pepper"],
    steps: [
      "Heat oil in a pan on medium-high heat.",
      "Scramble the eggs quickly, then push them aside.",
      "Toss in the rice and stir-fry 3 minutes until toasty.",
      "Mix everything, season, and serve hot.",
    ],
    tip: "Cold day-old rice fries up fluffier than fresh rice — trust me on this one!",
  },
  {
    keys: ["bread", "cheese"],
    title: "Golden Cheese Toastie 🧀",
    time: 5,
    method: "Stovetop",
    ingredients: ["2 slices bread", "2 slices cheese", "Butter", "Pinch of pepper"],
    steps: [
      "Butter the outside of both bread slices.",
      "Sandwich the cheese in the middle.",
      "Toast in a pan 2-3 minutes per side on medium heat.",
      "Slice diagonally — it always tastes better that way.",
    ],
    tip: "Pop a lid on the pan for a minute so the cheese melts before the bread browns!",
  },
  {
    keys: ["flour", "milk", "eggs"],
    title: "Tiny Pantry Crepes 🥞",
    time: 15,
    method: "Stovetop",
    ingredients: ["1/2 cup flour", "3/4 cup milk", "1 egg", "Pinch of sugar & salt"],
    steps: [
      "Whisk everything into a smooth, thin batter.",
      "Rest the batter 5 minutes while the pan heats.",
      "Pour a thin swirl into a greased pan, cook 1 minute per side.",
      "Fill with syrup or banana slices and roll up.",
    ],
    tip: "If the batter feels thick, splash in a little more milk — crepes love being runny!",
  },
  {
    keys: ["bananas"],
    title: "Caramel-y Pan Bananas 🍌",
    time: 5,
    method: "Stovetop",
    ingredients: ["1 banana", "1 tsp butter", "1 tsp sugar", "Pinch of cinnamon"],
    steps: [
      "Slice the banana into thick coins.",
      "Melt butter and sugar in a pan until bubbly.",
      "Add bananas, cook 1 minute per side until golden.",
      "Dust with cinnamon and eat warm.",
    ],
    tip: "Spoon these over toast or yogurt for an instant dessert — so cozy!",
  },
  {
    keys: ["tomatoes", "bread"],
    title: "Cozy Tomato Toast 🍅",
    time: 10,
    method: "Stovetop",
    ingredients: ["2 slices bread", "1 tomato", "Olive oil", "Salt & pepper"],
    steps: [
      "Toast the bread in a dry pan until crisp.",
      "Sauté chopped tomato with oil for 4 minutes.",
      "Mash lightly, season, and pile onto the toast.",
      "Finish with a pinch of pepper.",
    ],
    tip: "A tiny pinch of sugar tames extra-tangy tomatoes — sneaky little trick!",
  },
];

const FALLBACK: Recipe = {
  title: "Chef's Pantry Scramble 🍳",
  time: 10,
  method: "Stovetop",
  ingredients: ["Whatever you picked!", "1 tsp oil or butter", "Salt & pepper"],
  steps: [
    "Chop your ingredients into small, friendly pieces.",
    "Warm oil in a pan over medium heat.",
    "Cook the sturdiest items first, softest ones last.",
    "Season, taste, and plate it up with a smile.",
  ],
  tip: "When in doubt: heat, fat, salt and a little patience make anything tasty!",
};

function pickRecipe(items: string[], quickOnly: boolean, filter: FilterId): Recipe {
  const range = TIME_FILTERS.find((f) => f.id === filter)!;
  const lower = items.map((i) => i.toLowerCase());
  const scored = RECIPES.map((r) => ({
    r,
    score: r.keys.filter((k) => lower.some((l) => l.includes(k))).length / r.keys.length,
  }))
    .filter((s) => s.score > 0)
    .filter((s) => s.r.time >= range.min && s.r.time <= range.max)
    .filter((s) => (quickOnly ? s.r.method !== "Oven" : true))
    .sort((a, b) => b.score - a.score || a.r.time - b.r.time);
  return scored[0]?.r ?? { ...FALLBACK, time: Math.max(5, Math.min(range.max, 10)) };
}

const INTRO_LINE =
  "Oh hi there! 🍳 Got random ingredients and limited time? Let's make something yummy!";

function Index() {
  const [started, setStarted] = useState(false);
  const [typed, setTyped] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [quickOnly, setQuickOnly] = useState(true);
  const [filter, setFilter] = useState<FilterId>("quick");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [sparkle, setSparkle] = useState(false);
  const [seconds, setSeconds] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recipe book
  const { book, save, update, remove, isSaved } = useRecipeBook();
  const [showBook, setShowBook] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Floating scroll mascot
  const headerRef = useRef<HTMLElement | null>(null);
  const pantryRef = useRef<HTMLElement | null>(null);
  const prefsRef = useRef<HTMLElement | null>(null);
  const stepsRef = useRef<HTMLOListElement | null>(null);
  const [floatVisible, setFloatVisible] = useState(false);
  const [floatMsg, setFloatMsg] = useState("Item's please!!");
  const [bob, setBob] = useState(0);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      setBob(Math.sin(window.scrollY / 90) * 10);

      const stepsTop = stepsRef.current?.getBoundingClientRect().top;
      const prefsTop = prefsRef.current?.getBoundingClientRect().top;
      // Hide the floating mascot once the Steps section approaches, so it never
      // overlaps ingredients, Chef's Thought, steps, checklist or the timer.
      const nearSteps = stepsTop !== undefined && stepsTop < vh * 0.9;
      setFloatVisible(headerBottom < 0 && !nearSteps && !showBook);

      if (recipe) {
        setFloatMsg("Tadaa! Here's your recipe. Check off steps as you go! 💛");
      } else if (prefsTop !== undefined && prefsTop < vh * 0.6) {
        setFloatMsg("Oven or No-Oven?");
      } else {
        setFloatMsg("Item's please!!");
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [started, recipe, showBook]);

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);


  // Typewriter intro
  useEffect(() => {
    if (started) return;
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i += 1;
      setTyped(INTRO_LINE.slice(0, i));
      if (i >= INTRO_LINE.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [started]);

  useEffect(() => {
    if (seconds === null || seconds <= 0) return;
    timerRef.current = setInterval(() => setSeconds((s) => (s === null ? null : s - 1)), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [seconds]);

  const toggle = (item: string) =>
    setSelected((s) => (s.includes(item) ? s.filter((i) => i !== item) : [...s, item]));

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    if (!selected.includes(v)) setSelected((s) => [...s, v]);
    setCustom("");
  };

  const generate = () => {
    setLoading(true);
    setRecipe(null);
    setSparkle(false);
    setChecked({});
    setSeconds(null);
    setTimeout(() => {
      const r = pickRecipe(selected, quickOnly, filter);
      setRecipe(r);
      setLoading(false);
      setSparkle(true);
      setTimeout(() => setSparkle(false), 1800);
    }, 1400);
  };

  const speech = loading
    ? "Stirring the pot... 🍲"
    : selected.length
      ? `Ooh, ${selected.length} pantry treasure${selected.length > 1 ? "s" : ""}! Ready when you are.`
      : "Select what's in your pantry, and I'll whip up something delicious!";


  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!started) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 py-10 font-nunito text-foreground">
        <section className="animate-scale-in w-full max-w-md rounded-[2.5rem] border-2 border-dashed border-secondary bg-card p-8 text-center shadow-[var(--shadow-cozy)]">
          <div className="mx-auto flex h-52 w-52 items-center justify-center sm:h-64 sm:w-64">
            <img
              src={chefMascot}
              alt="Cozy chef mascot smiling"
              width={768}
              height={768}
              loading="eager"
              decoding="async"
              className="h-48 w-48 object-contain sm:h-60 sm:w-60"
            />
          </div>
          <div className="relative mt-6 rounded-3xl bg-secondary px-5 py-4 text-left text-sm font-semibold text-secondary-foreground shadow-[var(--shadow-soft)]">
            <span
              className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-secondary"
              aria-hidden
            />
            <p className="min-h-[3.5rem] font-nunito">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse align-middle bg-current" />
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="mt-6 w-full rounded-full bg-primary px-6 py-4 text-lg font-fredoka font-extrabold text-primary-foreground shadow-[var(--shadow-cozy)] transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Let&apos;s Cook! ✨
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 font-nunito text-foreground sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Header & mascot */}
        <header ref={headerRef} className="animate-fade-in rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <img
              src={chefFull}
              alt="Cozy chef mascot holding a wooden spoon"
              width={768}
              height={768}
              loading="eager"
              decoding="async"
              className="h-24 w-24 shrink-0 object-contain sm:h-32 sm:w-32"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Cozy Pantry
                  </p>
                  <h1 className="font-fredoka text-2xl font-extrabold leading-tight sm:text-3xl">
                    Recipe Companion 🍳
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBook(true)}
                  className="shrink-0 rounded-full bg-accent px-3 py-2 font-fredoka text-xs font-bold text-accent-foreground shadow-[var(--shadow-soft)] transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  📖 My Recipe Book
                </button>
              </div>
              <div className="relative mt-3 rounded-3xl bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground shadow-[var(--shadow-soft)]">
                <span
                  className="absolute -top-2 left-6 h-4 w-4 rotate-45 bg-secondary sm:-left-2 sm:top-5"
                  aria-hidden
                />
                <p key={speech} className="animate-fade-in">
                  {speech}
                </p>
              </div>
            </div>
          </div>
        </header>

        {showBook ? (
          <RecipeBook
            book={book}
            mascotsrc={chefMascot}
            onUpdate={update}
            onRemove={remove}
            onToast={setToast}
            onBack={() => setShowBook(false)}
          />
        ) : (
          <>
            {/* Ingredient selector */}
        <section
          ref={pantryRef}

          className="animate-fade-in rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7"
          style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
        >
          <h2 className="font-fredoka text-lg font-bold">What&apos;s in your pantry?</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PANTRY.map((item) => {
              const on = selected.includes(item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => toggle(item.name)}
                  aria-pressed={on}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                    on
                      ? "border-transparent bg-mint text-secondary-foreground shadow-[var(--shadow-soft)]"
                      : "border-border bg-muted text-foreground hover:bg-accent"
                  }`}
                >
                  {item.symbol}&nbsp;{item.name}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex gap-2">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="Add your own… e.g. Peanut butter"
              aria-label="Custom ingredient"
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={addCustom}
              className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Add +
            </button>
          </div>

          {/* Basket */}
          <div className="mt-5 rounded-3xl border-2 border-dashed border-border bg-muted/60 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              SELECTED PANTRY BASKET&nbsp;
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.length === 0 && (
                <p className="text-sm text-muted-foreground">Your basket is empty… let&apos;s fill it!</p>
              )}
              {selected.map((item) => (
                <span
                  key={item}
                  className="animate-scale-in flex items-center gap-2 rounded-full bg-mint px-3 py-1.5 text-sm font-semibold text-secondary-foreground shadow-[var(--shadow-soft)]"
                >
                  {symbolFor(item)}&nbsp;{item}
                  <button
                    type="button"
                    aria-label={`Remove ${item}`}
                    onClick={() => toggle(item)}
                    className="grid h-5 w-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground transition-transform hover:scale-110"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section
          ref={prefsRef}

          className="animate-fade-in rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7"
          style={{ animationDelay: "220ms", animationFillMode: "backwards" }}
        >
          <h2 className="font-fredoka text-lg font-bold">Quick preferences</h2>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-3xl bg-muted px-4 py-3">
            <span className="text-sm font-semibold">No-Oven / Quick Stovetop only 🔥</span>
            <button
              type="button"
              role="switch"
              aria-checked={quickOnly}
              aria-label="No-oven quick stovetop only"
              onClick={() => setQuickOnly((q) => !q)}
              className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${quickOnly ? "bg-mint" : "bg-border"}`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-card shadow transition-all duration-300 ${quickOnly ? "left-7" : "left-1"}`}
              />
            </button>
          </div>

          <div className="mt-4">
            <span className="text-sm font-semibold">How much time do you have? ⏱️</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {TIME_FILTERS.map((f) => {
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={on}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                      on
                        ? "border-transparent bg-mint text-secondary-foreground shadow-[var(--shadow-soft)]"
                        : "border-border bg-muted text-foreground hover:bg-accent"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Generate */}
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="rounded-3xl bg-primary px-6 py-5 font-fredoka text-lg font-extrabold text-primary-foreground shadow-[var(--shadow-cozy)] transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-70"
        >
          {loading ? "Stirring the pot… 🍲" : "Cook Magic with Me ✨"}
        </button>

        {loading && (
          <div className="animate-fade-in rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-cozy)]">
            <div className="animate-bounce text-5xl">🍲</div>
            <p className="mt-3 font-semibold">Chef is stirring the pot...</p>
            <p className="text-sm text-muted-foreground">Tasting, seasoning, sprinkling love…</p>
          </div>
        )}

        {/* Recipe card */}
        {recipe && !loading && (
          <section className="animate-scale-in relative overflow-hidden rounded-3xl border-2 border-dashed border-secondary bg-recipe p-5 shadow-[var(--shadow-cozy)] sm:p-7">
            {sparkle && (
              <div className="pointer-events-none absolute inset-0 animate-fade-in" aria-hidden>
                {["✨", "⭐", "💛", "✨", "⭐", "💫"].map((s, i) => (
                  <span
                    key={i}
                    className="absolute animate-ping text-xl"
                    style={{ left: `${8 + i * 15}%`, top: `${(i % 3) * 28 + 8}%` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <h2 className="font-fredoka text-2xl font-extrabold">{recipe.title}</h2>
              {(() => {
                const alreadySaved = isSaved(recipe.title, recipe.steps);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      const saved = save({
                        title: recipe.title,
                        description: recipe.tip,
                        ingredients: recipe.ingredients,
                        steps: recipe.steps,
                        time: recipe.time,
                        method: recipe.method,
                        difficulty: "Beginner",
                      });
                      if (saved) setToast("Recipe saved! 🥰");
                    }}
                    disabled={alreadySaved}
                    className={`shrink-0 rounded-full px-3 py-2 font-fredoka text-xs font-bold transition-transform duration-200 hover:scale-105 active:scale-95 ${
                      alreadySaved
                        ? "bg-muted text-muted-foreground"
                        : "bg-accent text-accent-foreground shadow-[var(--shadow-soft)]"
                    }`}
                  >
                    {alreadySaved ? "Saved ♥" : "♡ Save Recipe"}
                  </button>
                );
              })()}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-accent px-3 py-1 font-fredoka text-xs font-bold text-accent-foreground">
                ⏱️ {recipe.time} min
              </span>
              <span className="rounded-full bg-mint px-3 py-1 font-fredoka text-xs font-bold text-secondary-foreground">
                🍳 {recipe.method}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 font-fredoka text-xs font-bold">🟢 Beginner</span>
            </div>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Ingredients
            </h3>
            <ul className="mt-2 space-y-2">
              {recipe.ingredients.map((ing) => {
                const k = `i-${ing}`;
                return (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => setChecked((c) => ({ ...c, [k]: !c[k] }))}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-all duration-200 hover:scale-[1.01] ${
                        checked[k] ? "bg-mint/60 text-muted-foreground line-through" : "bg-card"
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border border-border text-xs font-bold ${
                          checked[k] ? "bg-mint text-secondary-foreground" : "bg-card"
                        }`}
                      >
                        {checked[k] ? "✔" : ""}
                      </span>
                      {ing}
                    </button>
                  </li>
                );
              })}
            </ul>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Steps
            </h3>
            <ol ref={stepsRef} className="mt-2 space-y-2">
              {recipe.steps.map((step, i) => {
                const k = `s-${i}`;
                return (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => setChecked((c) => ({ ...c, [k]: !c[k] }))}
                      className={`flex w-full items-start gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-all duration-200 hover:scale-[1.01] ${
                        checked[k] ? "bg-mint/60 text-muted-foreground line-through" : "bg-card"
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          checked[k]
                            ? "bg-mint text-secondary-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {checked[k] ? "✔" : i + 1}
                      </span>
                      {step}
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Chef's Thought */}
            <div className="mt-6 flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-end justify-center sm:h-20 sm:w-20">
                <img
                  src={chefMascot}
                  alt=""
                  loading="eager"
                  width={768}
                  height={768}
                  className="h-14 w-14 object-contain sm:h-20 sm:w-20"
                />
              </div>
              <div className="relative flex-1 rounded-3xl bg-card px-4 py-3 shadow-[var(--shadow-soft)]">
                <span
                  className="absolute -left-1.5 top-6 h-3 w-3 rotate-45 bg-card"
                  aria-hidden
                />
                <p className="font-fredoka text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Chef&apos;s Thought 💭
                </p>
                <p className="mt-1 text-sm font-medium">{recipe.tip}</p>
              </div>
            </div>

            {/* Auto timer */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSeconds(seconds === null ? recipe.time * 60 : null)}
                className={`rounded-full bg-primary px-5 py-3 font-fredoka text-sm font-bold text-primary-foreground transition-transform duration-200 hover:scale-105 active:scale-95 ${
                  seconds !== null && seconds > 0 ? "animate-pulse" : ""
                }`}
              >
                {seconds === null
                  ? `Start ${recipe.time}-Min Cooking Timer ⏱️`
                  : "Stop timer 🛑"}
              </button>
              {seconds !== null && (
                <span className="rounded-full bg-mint px-4 py-2 font-mono text-lg font-bold text-secondary-foreground">
                  {seconds > 0 ? mmss(seconds) : "Ding! 🔔 It's ready!"}
                </span>
              )}
            </div>
          </section>
        )}

          </>
        )}

        <footer className="pb-6 text-center text-xs text-muted-foreground">
          Made with love · Your chef says: eat something warm today 💛
        </footer>
      </div>

      {/* Floating scroll mascot (head only) */}
      <div
        aria-hidden={!floatVisible}
        className={`pointer-events-none fixed right-1 top-1/3 z-40 flex max-w-[42vw] flex-col items-center transition-all duration-500 sm:right-3 sm:max-w-none ${
          floatVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
        }`}
        style={{ transform: floatVisible ? `translateY(${bob}px)` : undefined }}
      >
        <div className="mb-2 max-w-[38vw] rounded-2xl bg-secondary px-3 py-2 text-center text-[11px] font-semibold text-secondary-foreground shadow-[var(--shadow-soft)] sm:max-w-[14rem] sm:text-sm">
          <p key={floatMsg} className="animate-fade-in font-nunito">
            {floatMsg}
          </p>
        </div>
        <img
          src={chefMascot}
          alt="chef"
          width={768}
          height={768}
          loading="eager"
          decoding="async"
          className="h-16 w-16 object-contain sm:h-24 sm:w-24"
        />
      </div>

      {/* Toast */}
      <div
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-primary px-5 py-2.5 font-fredoka text-sm font-bold text-primary-foreground shadow-[var(--shadow-cozy)] transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        {toast}
      </div>

    </main>
  );
}

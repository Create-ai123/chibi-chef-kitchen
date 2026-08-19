import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import chefMascot from "@/assets/chibi-chef.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cozy Pantry Recipe Companion | Chibi Chef Snacks" },
      {
        name: "description",
        content:
          "Pick what's in your pantry and let the chibi chef whip up a quick stovetop or microwave snack in minutes.",
      },
      { property: "og:title", content: "Cozy Pantry Recipe Companion" },
      {
        property: "og:description",
        content:
          "A cute pantry-to-recipe helper: choose ingredients, set your time, and cook magic with the chibi chef.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PANTRY = [
  "Oats 🌾",
  "Milk 🥛",
  "Flour 🌾",
  "Eggs 🥚",
  "Tomatoes 🍅",
  "Chocolate Syrup 🍫",
  "Bananas 🍌",
  "Bread 🍞",
  "Rice 🍚",
  "Cheese 🧀",
];

const TIMES = [5, 10, 15, 20];

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
    tip: "Cold day-old rice fries up fluffier than fresh rice!",
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
    tip: "Cover the pan for a minute so the cheese melts before the bread browns.",
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
    tip: "If the batter feels thick, splash in more milk — crepes love being runny.",
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
    tip: "Spoon these over toast or yogurt for an instant dessert!",
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
    tip: "A tiny pinch of sugar tames extra-tangy tomatoes.",
  },
];

const FALLBACK: Recipe = {
  title: "Chibi Chef's Pantry Scramble 🍳",
  time: 10,
  method: "Stovetop",
  ingredients: ["Whatever you picked!", "1 tsp oil or butter", "Salt & pepper"],
  steps: [
    "Chop your ingredients into small, friendly pieces.",
    "Warm oil in a pan over medium heat.",
    "Cook the sturdiest items first, softest ones last.",
    "Season, taste, and plate it up with a smile.",
  ],
  tip: "When in doubt: heat, fat, salt, and a little patience make anything tasty.",
};

function pickRecipe(items: string[], quickOnly: boolean, maxTime: number): Recipe {
  const lower = items.map((i) => i.toLowerCase());
  const scored = RECIPES.map((r) => ({
    r,
    score: r.keys.filter((k) => lower.some((l) => l.includes(k))).length / r.keys.length,
  }))
    .filter((s) => s.score > 0)
    .filter((s) => (maxTime >= 20 ? true : s.r.time <= maxTime))
    .filter((s) => (quickOnly ? s.r.method !== "Oven" : true))
    .sort((a, b) => b.score - a.score || a.r.time - b.r.time);
  return scored[0]?.r ?? { ...FALLBACK, time: Math.min(maxTime, 10) };
}

function Index() {
  const [selected, setSelected] = useState<string[]>(["Oats 🌾", "Milk 🥛"]);
  const [custom, setCustom] = useState("");
  const [quickOnly, setQuickOnly] = useState(true);
  const [timeIdx, setTimeIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [sparkle, setSparkle] = useState(false);
  const [seconds, setSeconds] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (seconds === null) return;
    if (seconds <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setSeconds((s) => (s === null ? null : s - 1)), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [seconds !== null, seconds === 0]);

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
      setRecipe(pickRecipe(selected, quickOnly, TIMES[timeIdx] ?? 5));
      setLoading(false);
      setSparkle(true);
      setTimeout(() => setSparkle(false), 1600);
    }, 1400);
  };

  const speech = loading
    ? "Chibi Chef is stirring the pot... 🍲"
    : recipe
      ? "Tadaa! Here's your cozy little recipe. Check off steps as you go! 💛"
      : selected.length
        ? `Ooh, ${selected.length} pantry treasure${selected.length > 1 ? "s" : ""}! Ready when you are.`
        : "Kon'nichiwa! Select what's in your pantry, and I'll whip up something delicious!";

  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Header & mascot */}
        <header className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <img
              src={chefMascot}
              alt="Chibi chef mascot holding a wooden spoon"
              width={768}
              height={768}
              className={`h-28 w-28 shrink-0 drop-shadow-md transition-transform duration-500 ${loading ? "animate-bounce" : "hover:scale-105"}`}
            />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Cozy Pantry
              </p>
              <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                Recipe Companion 🍳
              </h1>
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

        {/* Ingredient selector */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7">
          <h2 className="text-lg font-bold">What&apos;s in your pantry?</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PANTRY.map((item) => {
              const on = selected.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(item)}
                  aria-pressed={on}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                    on
                      ? "border-transparent bg-secondary text-secondary-foreground shadow-[var(--shadow-soft)]"
                      : "border-border bg-muted text-foreground hover:bg-accent"
                  }`}
                >
                  {item}
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
              Add ➕
            </button>
          </div>

          {/* Basket */}
          <div className="mt-5 rounded-3xl border-2 border-dashed border-border bg-muted/60 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Selected Pantry Basket 🧺
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.length === 0 && (
                <p className="text-sm text-muted-foreground">Your basket is empty… let&apos;s fill it!</p>
              )}
              {selected.map((item) => (
                <span
                  key={item}
                  className="animate-scale-in flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm font-semibold shadow-[var(--shadow-soft)]"
                >
                  {item}
                  <button
                    type="button"
                    aria-label={`Remove ${item}`}
                    onClick={() => toggle(item)}
                    className="grid h-5 w-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground transition-transform hover:scale-110"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7">
          <h2 className="text-lg font-bold">Quick preferences</h2>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-3xl bg-muted px-4 py-3">
            <span className="text-sm font-semibold">No-Oven / Quick Stovetop only 🔥</span>
            <button
              type="button"
              role="switch"
              aria-checked={quickOnly}
              onClick={() => setQuickOnly((q) => !q)}
              className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${quickOnly ? "bg-secondary" : "bg-border"}`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-card shadow transition-all duration-300 ${quickOnly ? "left-7" : "left-1"}`}
              />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Time to cook ⏱️</span>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                {TIMES[timeIdx] === 20 ? "20+ min" : `${TIMES[timeIdx]} min`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={timeIdx}
              onChange={(e) => setTimeIdx(Number(e.target.value))}
              aria-label="Maximum cooking time"
              className="mt-3 w-full accent-[var(--primary)]"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20+</span>
            </div>
          </div>
        </section>

        {/* Generate */}
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="rounded-3xl bg-primary px-6 py-5 text-lg font-extrabold text-primary-foreground shadow-[var(--shadow-cozy)] transition-all duration-200 hover:scale-105 hover:animate-pulse active:scale-95 disabled:opacity-70"
        >
          {loading ? "Stirring the pot… 🍲" : "Cook Magic with Me ✨"}
        </button>

        {loading && (
          <div className="animate-fade-in rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-cozy)]">
            <div className="animate-bounce text-5xl">🍲</div>
            <p className="mt-3 font-semibold">Chibi Chef is stirring the pot...</p>
            <p className="text-sm text-muted-foreground">Tasting, seasoning, sprinkling love…</p>
          </div>
        )}

        {/* Recipe card */}
        {recipe && !loading && (
          <section
            className={`animate-scale-in relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7 ${sparkle ? "ring-4 ring-secondary" : ""}`}
          >
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

            <h2 className="text-2xl font-extrabold">{recipe.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                ⏱️ {recipe.time} min
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                🍳 {recipe.method}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">🟢 Beginner</span>
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
                        checked[k] ? "bg-secondary/60 text-muted-foreground line-through" : "bg-muted"
                      }`}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-border bg-card text-xs">
                        {checked[k] ? "✓" : ""}
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
            <ol className="mt-2 space-y-2">
              {recipe.steps.map((step, i) => {
                const k = `s-${i}`;
                return (
                  <li key={k}>
                    <button
                      type="button"
                      onClick={() => setChecked((c) => ({ ...c, [k]: !c[k] }))}
                      className={`flex w-full items-start gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-all duration-200 hover:scale-[1.01] ${
                        checked[k] ? "bg-secondary/60 text-muted-foreground line-through" : "bg-muted"
                      }`}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      {step}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 flex items-start gap-3 rounded-3xl bg-accent/70 p-4">
              <img
                src={chefMascot}
                alt=""
                loading="lazy"
                width={768}
                height={768}
                className="h-12 w-12 shrink-0"
              />
              <p className="text-sm font-medium">
                <span className="font-bold">Chibi Chef pro-tip:</span> {recipe.tip}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSeconds(seconds === null ? recipe.time * 60 : null)}
                className={`rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform duration-200 hover:scale-105 active:scale-95 ${
                  seconds !== null && seconds > 0 ? "animate-pulse" : ""
                }`}
              >
                {seconds === null ? `Start ${recipe.time}-Min Timer ⏲️` : "Stop timer ⏹️"}
              </button>
              {seconds !== null && (
                <span className="rounded-full bg-secondary px-4 py-2 font-mono text-lg font-bold text-secondary-foreground">
                  {seconds > 0 ? mmss(seconds) : "Ding! 🔔 It's ready!"}
                </span>
              )}
            </div>
          </section>
        )}

        <footer className="pb-6 text-center text-xs text-muted-foreground">
          Made cozy with love · Chibi Chef says: eat something warm today 💛
        </footer>
      </div>
    </main>
  );
}

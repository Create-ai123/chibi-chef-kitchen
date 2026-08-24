# What's in your pantry

write me a CSS, JS, HTML for this.
Project Title:  Cozy Pantry Recipe Companion 

Overview:

Create a playful, interactive, single-page web app with a cute chibi visual style (soft pastel palette: warm cream, soft mint green, pastel pink, and warm yellow). The app helps users make quick recipes using ingredients they have in their pantry, guided by an animated mascot.

Visual Style Guide (Chibi Aesthetic):

Theme: Cute, cozy, warm, and inviting with rounded UI elements (rounded-3xl), soft drop shadows, and pill-shaped badges.

Mascot Integration: Place a cute chibi chef mascot character near the header/hero section that reacts to user actions (e.g., displaying speech bubbles with friendly prompts).

Color Palette: Soft pastel background (#FFFDF7), mint accent (#A8E6CF), cute pink buttons (#FFAAA5), and warm brown text (#4A3F35).

Interactive Micro-Animations & Effects:

Bouncy Hover Effects: Buttons and category chips should slightly scale up (hover:scale-105) and bounce on click.

Pantry Selection Animation: Selecting an ingredient chip makes it pop into the "Selected Pantry Basket" with a smooth fade/scale transition.

Recipe Generation Animation: Clicking the generate button triggers a fun loading state with a cooking pot icon/gif and text like "Chibi Chef is stirring the pot...".

Confetti / Celebration: Trigger a gentle spark/star pulse effect when the recipe card is revealed.

Key UI Sections:

Header & Mascot Welcome:

Mascot display with speech bubble: "Kon'nichiwa! Select what's in your pantry, and I'll whip up something delicious!"

Interactive Ingredient Selector:

Category Pills: Quick-click tags for pantry items: Oats 🌾, Milk 🥛, Flour 🌾, Eggs 🥚, Tomatoes 🍅, Chocolate Syrup 🍫, Bananas 🍌, Bread 🍞, Rice 🍚, Cheese 🧀.

Custom Input: Input box to type custom items with an "Add ➕" button.

Visual Pantry Basket: A cute container showing active ingredients as removable tags with cute 'X' icons.

Quick Preferences (Keep It Simple):

"No-Oven / Quick Stovetop" Switch: Simple toggle for stove/microwave recipes only.

Time Slider: 5 min, 10 min, 15 min, 20+ min.

Generate Button:

Large, cute primary button: "Cook Magic with Me✨" with pulse hover effect.

Interactive Recipe Card:

Header: Cute dish title with badges (⏱️ Time, 🍳 Stovetop/Microwave, 🟢 Beginner).

Interactive Checklist: Clickable checkboxes for ingredients and step-by-step instructions (checking off a step strikes through the text with a soft green highlight).

Chibi Chef Pro-Tip: A highlighted speech box with a quick cooking tip.

Built-in Timer: Simple interactive countdown timer button (e.g., "Start 5-Min Timer") that plays a soft visual pulse while active.

Functionality:

Pre-populate with realistic, instant mock recipe generation logic focused on simple stovetop/microwave snacks (like oat mug cakes, quick crepes, fried rice, or toasted snacks) so it works instantly without needing external API keys.

Ensure high UI responsiveness using Tailwind CSS, smooth transitions, and rounded card components.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d2beeb5f-bc90-41a7-9029-a02fa937d9ec).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

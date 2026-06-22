# Sorting Visualizer

An interactive, browser-based tool for visualizing classic sorting algorithms in real time. Watch how Bubble Sort, Merge Sort, Quick Sort, and more work step by step — with color-coded animations and adjustable speed.

---

## Demo

> Generate an array → pick an algorithm → hit **Sort** 

![Sorting Visualizer Demo](./assets/demo.gif)

---

## Algorithms

| Algorithm      | Time (avg) | Time (worst) | Space  |
|----------------|------------|--------------|--------|
| Bubble Sort    | O(n²)      | O(n²)        | O(1)   |
| Selection Sort | O(n²)      | O(n²)        | O(1)   |
| Insertion Sort | O(n²)      | O(n²)        | O(1)   |
| Merge Sort     | O(n log n) | O(n log n)   | O(n)   |
| Quick Sort     | O(n log n) | O(n²)        | O(log n)|

---

## Color Guide

| Color  | Meaning                              |
|--------|--------------------------------------|
| Blue   | Elements currently being compared    |
| Yellow | Pivot (Quick Sort) / Minimum tracker (Selection Sort) |
| Green  | Element is in its final sorted position |

---

## Features

- 5 sorting algorithms with step-by-step animation
- Adjustable array size (5 – 100 elements)
- Adjustable speed (0.5x – 4x)
- Randomize array at any time
- Responsive navbar for mobile

---

## Getting Started

No build tools or dependencies required — runs entirely in the browser.

**1. Clone the repository**
```bash
git clone https://github.com/your-username/sorting-visualizer.git
cd sorting-visualizer
```

**2. Open in browser**
```bash
# Just open the file directly
open index.html

# Or serve locally (recommended to avoid CORS issues)
npx serve .
```

---

## Project Structure

```
sorting-visualizer/
├── index.html
├── favicon.ico
├── css/
│   └── style.css
└── scripts/
    ├── app.js               # UI logic: render, randomize, event listeners
    ├── helper.js            # Animation primitives: mark, swap, compare, pause
    └── sort-algorithms.js   # All 5 sorting algorithm implementations
```

---

## How It Works

**`app.js`** handles the UI — reads dropdown values, generates a random array, and renders bars inside `.array` as `div.cell` elements. Each bar's height and `value` attribute represent its magnitude.

**`helper.js`** provides animation primitives used by every algorithm:
- `mark(i)` / `unmark(i)` — highlights and resets a bar's color
- `compare(i, j)` — reads two bars' values and returns whether a swap is needed
- `swap(i, j)` — updates both the `value` attribute and bar height in the DOM
- `pause()` — introduces a delay so each step is visible (controlled by speed setting)

**`sort-algorithms.js`** implements each algorithm by calling Helper methods. The DOM is the source of truth — there is no separate JS array; all reads and writes happen directly on the bar elements.

---

## Known Limitations

- Sorting cannot be paused or stopped mid-run — refreshing the page resets everything
- Quick Sort uses the last element as pivot (Lomuto scheme) — worst case O(n²) on already-sorted arrays
- Merge Sort's bar height multiplier (`3.5`) slightly differs from the render multiplier (`3.8`) — merged bars appear marginally shorter

---

## License

MIT

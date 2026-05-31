"use strict";

// Reads selected algorithm and speed, then runs the corresponding sort
const start = async () => {
  let algoValue = Number(document.querySelector(".algo-menu").value);
  let speedValue = Number(document.querySelector(".speed-menu").value);

  if (speedValue === 0) speedValue = 1; // fallback: prevent zero-speed (infinite delay)
  if (algoValue === 0) {
    alert("No Algorithm Selected");
    return;
  }

  // sortAlgorithms class takes speed as constructor arg to control animation delay
  let algorithm = new sortAlgorithms(speedValue);
  if (algoValue === 1) await algorithm.BubbleSort();
  if (algoValue === 2) await algorithm.SelectionSort();
  if (algoValue === 3) await algorithm.InsertionSort();
  if (algoValue === 4) await algorithm.MergeSort();
  if (algoValue === 5) await algorithm.QuickSort();
};

// Triggered when algo or size selection changes — re-renders the bar array
const RenderScreen = async () => {
  await RenderList();
};

// Clears the screen and renders a new random list as visual bars
// Bar height = 3.8 * value (px) — visually encodes the element's magnitude
const RenderList = async () => {
  let sizeValue = Number(document.querySelector(".size-menu").value);
  await clearScreen();
  let list = await randomList(sizeValue);
  const arrayNode = document.querySelector(".array");

  for (const element of list) {
    const node = document.createElement("div");
    node.className = "cell";
    node.setAttribute("value", String(element)); // value attr read by sort algorithms during swaps
    node.style.height = `${3.8 * element}px`;
    arrayNode.appendChild(node);
  }
};

// Renders the list as numbered boxes instead of bars
// If sorted=true, displays in ascending order (used for showing sorted state as text)
const RenderArray = async (sorted) => {
  let sizeValue = Number(document.querySelector(".size-menu").value);
  await clearScreen();
  let list = await randomList(sizeValue);
  if (sorted) list.sort((a, b) => a - b);

  const arrayNode = document.querySelector(".array");
  const divnode = document.createElement("div");
  divnode.className = "s-array";

  for (const element of list) {
    const dnode = document.createElement("div");
    dnode.className = "s-cell";
    dnode.innerText = element;
    divnode.appendChild(dnode);
  }
  arrayNode.appendChild(divnode);
};

// Generates an array of `Length` random integers between 1 and 100
const randomList = async (Length) => {
  let list = new Array();
  let lowerBound = 1;
  let upperBound = 100;
  for (let counter = 0; counter < Length; ++counter) {
    let randomNumber = Math.floor(
      Math.random() * (upperBound - lowerBound + 1) + lowerBound
    );
    list.push(parseInt(randomNumber));
  }
  return list;
};

// Wipes all rendered bars/cells from the display container
const clearScreen = async () => {
  document.querySelector(".array").innerHTML = "";
};

// Toggles the navbar for mobile (hamburger menu) — adds/removes "responsive" class
const response = () => {
  let Navbar = document.querySelector(".navbar");
  if (Navbar.className === "navbar") {
    Navbar.className += " responsive";
  } else {
    Navbar.className = "navbar";
  }
};

// Event listeners
document.querySelector(".icon").addEventListener("click", response);        // hamburger toggle
document.querySelector(".start").addEventListener("click", start);          // run sort
document.querySelector(".size-menu").addEventListener("change", RenderScreen); // re-render on size change
document.querySelector(".algo-menu").addEventListener("change", RenderScreen); // re-render on algo change
window.onload = RenderScreen; // render initial array on page load

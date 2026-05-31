"use strict";

// Shared utility class used by all sorting algorithms
// Handles DOM manipulation, animation timing, comparisons, and swaps
class Helper {

    // time: speed slider value — converted to ms delay (higher slider = lower delay = faster)
    // list: NodeList of .cell DOM elements representing the bars
    constructor(time, list = []) {
        this.time = parseInt(400 / time); // e.g. speed=1 → 400ms delay, speed=4 → 100ms delay
        this.list = list;
    }

    // Highlights a bar in "current" state (e.g. blue) — active comparison element
    mark = async (index) => {
        this.list[index].setAttribute("class", "cell current");
    }

    // Highlights a bar in "min" state (e.g. red/yellow) — used by Selection Sort for minimum tracker
    markSpl = async (index) => {
        this.list[index].setAttribute("class", "cell min");
    }

    // Resets bar back to default unsorted color
    unmark = async (index) => {
        this.list[index].setAttribute("class", "cell");
    }

    // Animation delay — all comparisons and swaps await this to make steps visible
    pause = async () => {
        return new Promise(resolve => {
            setTimeout(() => resolve(), this.time);
        });
    }

    // Compares values at two indices — returns true if left > right (i.e. a swap is needed)
    // Pauses before comparing so the highlight is visible before the decision
    compare = async (index1, index2) => {
        await this.pause();
        let value1 = Number(this.list[index1].getAttribute("value"));
        let value2 = Number(this.list[index2].getAttribute("value"));
        return value1 > value2;
    }

    // Swaps two bars visually: updates both the "value" attribute and bar height
    // Pauses before swapping so the animation step is visible
    // Note: only updates DOM — no separate JS array, the DOM is the source of truth
    swap = async (index1, index2) => {
        await this.pause();
        let value1 = this.list[index1].getAttribute("value");
        let value2 = this.list[index2].getAttribute("value");

        this.list[index1].setAttribute("value", value2);
        this.list[index1].style.height = `${3.8 * value2}px`; // height reflects new value

        this.list[index2].setAttribute("value", value1);
        this.list[index2].style.height = `${3.8 * value1}px`;
    }
}

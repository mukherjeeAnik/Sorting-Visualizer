"use strict";

// Contains all 5 sorting algorithm implementations
// Each algorithm animates step-by-step using Helper (mark, unmark, swap, compare, pause)
// "cell done" class = green bar (sorted in place), "cell current" = active comparison
class sortAlgorithms {

    constructor(time) {
        this.list = document.querySelectorAll(".cell"); // live NodeList of all bars
        this.size = this.list.length;
        this.time = time;
        this.help = new Helper(this.time, this.list);  // animation utility
    }

    // ----------------------------- BUBBLE SORT -----------------------------
    // Repeatedly compares adjacent pairs, bubbles largest to the end each pass
    // After pass i: rightmost i+1 elements are sorted → marked "done"
    // Time: O(n²) | Space: O(1)
    BubbleSort = async () => {
        for (let i = 0; i < this.size - 1; ++i) {
            for (let j = 0; j < this.size - i - 1; ++j) {
                await this.help.mark(j);
                await this.help.mark(j + 1);
                if (await this.help.compare(j, j + 1)) {
                    await this.help.swap(j, j + 1);
                }
                await this.help.unmark(j);
                await this.help.unmark(j + 1);
            }
            this.list[this.size - i - 1].setAttribute("class", "cell done"); // largest of pass is in place
        }
        this.list[0].setAttribute("class", "cell done"); // last remaining element
    }

    // ----------------------------- INSERTION SORT -----------------------------
    // Builds sorted portion left to right — each element shifts left until in place
    // Inner while loop walks element backwards, swapping until it finds its position
    // Time: O(n²) | Space: O(1)
    InsertionSort = async () => {
        for (let i = 0; i < this.size - 1; ++i) {
            let j = i;
            while (j >= 0 && await this.help.compare(j, j + 1)) {
                await this.help.mark(j);
                await this.help.mark(j + 1);
                await this.help.pause();
                await this.help.swap(j, j + 1);
                await this.help.unmark(j);
                await this.help.unmark(j + 1);
                j -= 1; // move one step left to continue shifting
            }
        }
        // Mark all done at the end (no single "done" per pass like Bubble Sort)
        for (let counter = 0; counter < this.size; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    // ----------------------------- SELECTION SORT -----------------------------
    // Finds the minimum in the unsorted portion and swaps it to position i
    // markSpl (yellow) = current minimum tracker, mark (blue) = current scan element
    // Time: O(n²) | Space: O(1)
    SelectionSort = async () => {
        for (let i = 0; i < this.size; ++i) {
            let minIndex = i; // assume first unsorted element is minimum
            for (let j = i; j < this.size; ++j) {
                await this.help.markSpl(minIndex); // highlight current min
                await this.help.mark(j);           // highlight element being compared
                if (await this.help.compare(minIndex, j)) {
                    await this.help.unmark(minIndex);
                    minIndex = j; // found new minimum
                }
                await this.help.unmark(j);
                await this.help.markSpl(minIndex); // re-highlight updated min
            }
            // Swap minimum into its sorted position
            await this.help.mark(minIndex);
            await this.help.mark(i);
            await this.help.pause();
            await this.help.swap(minIndex, i);
            await this.help.unmark(minIndex);
            this.list[i].setAttribute("class", "cell done"); // position i is finalized
        }
    }

    // ----------------------------- MERGE SORT -----------------------------
    // Recursively splits array in half, sorts each half, then merges them
    // Time: O(n log n) | Space: O(n) — newList array created per Merge call
    MergeSort = async () => {
        await this.MergeDivider(0, this.size - 1);
        for (let counter = 0; counter < this.size; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    // Recursively splits [start, end] into halves until single elements remain
    MergeDivider = async (start, end) => {
        if (start < end) {
            let mid = start + Math.floor((end - start) / 2); // avoids integer overflow vs (start+end)/2
            await this.MergeDivider(start, mid);
            await this.MergeDivider(mid + 1, end);
            await this.Merge(start, mid, end);
        }
    }

    // Merges two sorted halves [start..mid] and [mid+1..end] into sorted order
    // Builds merged result in newList, then writes values back to DOM bars
    Merge = async (start, mid, end) => {
        let newList = new Array();
        let frontcounter = start;   // pointer for left half
        let midcounter = mid + 1;   // pointer for right half

        // Standard merge: pick smaller of two pointers each step
        while (frontcounter <= mid && midcounter <= end) {
            let fvalue = Number(this.list[frontcounter].getAttribute("value"));
            let svalue = Number(this.list[midcounter].getAttribute("value"));
            if (fvalue >= svalue) {
                newList.push(svalue);
                ++midcounter;
            } else {
                newList.push(fvalue);
                ++frontcounter;
            }
        }
        // Drain remaining elements from whichever half wasn't exhausted
        while (frontcounter <= mid) {
            newList.push(Number(this.list[frontcounter].getAttribute("value")));
            ++frontcounter;
        }
        while (midcounter <= end) {
            newList.push(Number(this.list[midcounter].getAttribute("value")));
            ++midcounter;
        }

        // Highlight the merge window, write sorted values back one by one with animation
        for (let c = start; c <= end; ++c) {
            this.list[c].setAttribute("class", "cell current");
        }
        for (let c = start, point = 0; c <= end && point < newList.length; ++c, ++point) {
            await this.help.pause();
            this.list[c].setAttribute("value", newList[point]);
            this.list[c].style.height = `${3.5 * newList[point]}px`; // 3.5 here vs 3.8 in RenderList — minor inconsistency
        }
        for (let c = start; c <= end; ++c) {
            this.list[c].setAttribute("class", "cell"); // reset to default after merge
        }
    }

    // ----------------------------- QUICK SORT -----------------------------
    // Picks last element as pivot, partitions around it, recurses on both sides
    // Time: O(n log n) avg, O(n²) worst | Space: O(log n) call stack
    QuickSort = async () => {
        await this.QuickDivider(0, this.size - 1);
        for (let c = 0; c < this.size; ++c) {
            this.list[c].setAttribute("class", "cell done");
        }
    }

    // Recursively partitions [start, end] and sorts each side around pivot
    QuickDivider = async (start, end) => {
        if (start < end) {
            let pivot = await this.Partition(start, end); // pivot is now in final position
            await this.QuickDivider(start, pivot - 1);
            await this.QuickDivider(pivot + 1, end);
        }
    }

    // Lomuto partition scheme — pivot = last element (end)
    // Moves all elements < pivot to the left, then places pivot at correct index
    // Returns final pivot index
    Partition = async (start, end) => {
        let pivot = this.list[end].getAttribute("value"); // pivot value (not index)
        let prev_index = start - 1; // boundary of elements smaller than pivot

        await this.help.markSpl(end); // highlight pivot bar in yellow
        for (let c = start; c < end; ++c) {
            let currValue = Number(this.list[c].getAttribute("value"));
            await this.help.mark(c);
            if (currValue < pivot) {
                prev_index += 1;
                await this.help.mark(prev_index);
                await this.help.swap(c, prev_index); // move smaller element to left partition
                await this.help.unmark(prev_index);
            }
            await this.help.unmark(c);
        }
        await this.help.swap(prev_index + 1, end); // place pivot in its correct sorted position
        await this.help.unmark(end);
        return prev_index + 1; // return pivot's final index
    }
}

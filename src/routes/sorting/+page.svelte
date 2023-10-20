<script lang="ts">
    import { flip } from "svelte/animate";
    import { delay, generateUniqueRandomArray } from "$lib/helpers";

    let size: number = 30;
    let speed: any = 1000;
    let currentStep: any;
    let currentSelected: any;
    let currentPivot: any;
    let arr = generateUniqueRandomArray();
    let sortedArr: any;
    let mergeArr: any[];
    let showValues: boolean = false;
    let isRunning: boolean = false;

    function handleToggle() {
        showValues = !showValues;
    }

    function sizeChanged(size: number) {
        arr = generateUniqueRandomArray(size);
        sortedArr = [...arr];
    }

    function performAlgorithm(algorithm: string) {
        sortedArr = [...arr];
        isRunning = true;

        if (algorithm === "bubble") {
            bubbleSort();
        } else if (algorithm === "selection") {
            selectionSort();
        } else if (algorithm === "insertion") {
            insertionSort();
        } else if (algorithm === "merge") {
            mergeSort();
        } else if (algorithm === "quick") {
            quickSort();
        }
    }

    async function bubbleSort() {
        for (let i = 0; i < sortedArr.length - 1; i++) {
            for (let j = 0; j < sortedArr.length - i - 1; j++) {
                currentStep = j;
                currentSelected = j + 1;
                await delay(speed);
                if (sortedArr[j] > sortedArr[j + 1]) {
                    [sortedArr[j], sortedArr[j + 1]] = [
                        sortedArr[j + 1],
                        sortedArr[j],
                    ];
                }
            }
        }
        currentStep = -1;
        currentSelected = -1;
        isRunning = false;
    }

    async function selectionSort() {
        for (let i = 0; i < sortedArr.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < sortedArr.length; j++) {
                currentStep = j;
                currentSelected = minIndex;
                await delay(speed);
                if (sortedArr[j] < sortedArr[minIndex]) {
                    minIndex = j;
                }
            }
            [sortedArr[i], sortedArr[minIndex]] = [
                sortedArr[minIndex],
                sortedArr[i],
            ];
        }
        currentStep = -1;
        currentSelected = -1;
        isRunning = false;
    }

    async function insertionSort() {
        const sortableArr = sortedArr.map((num: any, i: any) => ({ num, i }));

        for (let i = 1; i < sortableArr.length; i++) {
            let j = i - 1;
            let key = sortableArr[i].num;

            while (j >= 0 && sortableArr[j].num > key) {
                currentStep = i;
                currentSelected = j;
                sortableArr[j + 1] = sortableArr[j];
                j--;
                sortableArr[j + 1] = { num: key, i: sortableArr[j + 1].i };
                await delay(speed);
            }

            sortedArr = sortableArr.map((item: any) => item.num);
        }

        currentStep = -1;
        currentSelected = -1;
        isRunning = false;
    }

    async function mergeSort(arr = sortedArr, leftIndex = 0, rightIndex = arr.length - 1) {
        if (leftIndex >= rightIndex) {
            return [arr[leftIndex]];
        }

        const mid = Math.floor((leftIndex + rightIndex) / 2);
        
        // Recursively sort the left and right halves
        const leftHalf: any = await mergeSort(arr, leftIndex, mid);
        const rightHalf: any = await mergeSort(arr, mid + 1, rightIndex);

        const mergedArray = [];
        let leftIndexPointer = 0;
        let rightIndexPointer = 0;

        // Merge the sorted halves with a delay and visualization
        while (leftIndexPointer < leftHalf.length && rightIndexPointer < rightHalf.length) {
            if (leftHalf[leftIndexPointer] < rightHalf[rightIndexPointer]) {
                mergedArray.push(leftHalf[leftIndexPointer]);
                leftIndexPointer++;
            } else {
                mergedArray.push(rightHalf[rightIndexPointer]);
                rightIndexPointer++;
            }

            // Visualize: Update currentStep and currentSelected
            currentStep = leftIndex + leftIndexPointer + rightIndexPointer;
            currentSelected = leftIndexPointer;
            mergeArr = [...mergedArray];
            await delay(speed); 
        }

        // Append the remaining elements (if any)
        while (leftIndexPointer < leftHalf.length) {
            mergedArray.push(leftHalf[leftIndexPointer]);
            leftIndexPointer++;
        }
        while (rightIndexPointer < rightHalf.length) {
            mergedArray.push(rightHalf[rightIndexPointer]);
            rightIndexPointer++;
        }

        // Visualize: Highlight the merged result
        for (let i = 0; i < mergedArray.length; i++) {
            arr[leftIndex + i] = mergedArray[i];
        }

        // Visualize: Reset currentStep and currentSelected
        sortedArr = [...arr];
        mergeArr = [];
        currentStep = -1;
        currentSelected = -1;

        return mergedArray;
    }

    async function quickSort(array = sortedArr, left = 0, right = array.length - 1) {
        if (left >= right) {
            return;
        }

        const pivotIndex = await partition(array, left, right);
        await quickSort(array, left, pivotIndex - 1);
        await quickSort(array, pivotIndex + 1, right);
    }

    async function partition(array: number[], left: number, right: number) {
        const pivot = array[right];
        let i = left - 1;
        
        for (let j = left; j < right; j++) {
            // Visualize: Highlight elements being compared
            currentSelected = j;
            currentStep = right;
            await delay(speed);

            if (array[j] < pivot) {
                i++;

                // Visualize: Swap elements
                await swap(array, i, j);
            }
        }

        // Visualize: Swap the pivot into its correct position
        await swap(array, i + 1, right);

        // Visualize: Reset selected element and pivot
        currentSelected = -1;
        currentStep = -1;
        currentPivot = -1;

        return i + 1;
    }

    async function swap(array: number[], i: number, j: number) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    $: sizeChanged(size);
</script>

<div class="flex flex-col items-center">
    <div class="flex flex-row overflow-x-auto h-48">
        {#each sortedArr as num, i (num)}
            <div
                class="flex flex-col items-center"
                style="margin-right: 1px;"
                animate:flip={{ duration: 1000 }}
            >
            <div
                class="flex items-center justify-center rounded"
                style="height: {25 + num}px; background-color: {i === currentStep ? 'red' : i === currentSelected ? 'green' : 'white'}; width: {90 / sortedArr.length}vw;"
            >
        
                    <!-- {num} -->
                </div>
                {#if showValues}
                    <span>{num}</span>
                {/if}
            </div>
        {/each}
    </div>

    {#if mergeArr}
    <div class="flex flex-row overflow-x-auto h-48">
        {#each mergeArr as num, i (num)}
            <div
                class="flex flex-col items-center"
                style="margin-right: 1px;"
                animate:flip={{ duration: 1000 }}
            >
                <div
                    class="flex  rounded"
                    style="height: {25 + num}px; background-color: orange; width: {90 / sortedArr.length}vw;"
                >
                </div>
                {#if showValues}
                    <span>{num}</span>
                {/if}
            </div>
        {/each}
    </div>
    {/if}
    

    <div class="flex mt-8">
        <button
            on:click={() => performAlgorithm("bubble")}
            disabled={isRunning}
            class="btn btn-primary mr-1">Bubble Sort</button
        >
        <button
            on:click={() => performAlgorithm("selection")}
            disabled={isRunning}
            class="btn btn-primary mr-1">Selection Sort</button
        >
        <button
            on:click={() => performAlgorithm("insertion")}
            disabled={isRunning}
            class="btn btn-primary mr-1">Insertion Sort</button
        >
        <button
            on:click={() => performAlgorithm("merge")}
            disabled={isRunning}
            class="btn btn-primary mr-1">Merge Sort</button
        >
        <button
            on:click={() => performAlgorithm("quick")}
            disabled={isRunning}
            class="btn btn-primary mr-1">Quick Sort</button
        >
        <button
            on:click={() => document.location.reload()}
            class="btn btn-secondary mr-1">Reset</button
        >
    </div>
    <input
        type="range"
        min="1"
        max="1000"
        bind:value={speed}
        disabled={isRunning}
        class="range w-auto mt-8"
    />
    <p>Speed: {speed}ms</p>

    <input
        bind:value={size}
        type="range"
        min="10"
        max="100"
        step="10"
        disabled={isRunning}
        class="range w-auto mt-8"
    />
    <p>Size: {size}</p>

    <div class="form-control mt-8">
        <label class="label cursor-pointer">
            <span class="label-text">Show Values</span>
            <input
                type="checkbox"
                class="toggle toggle-accent ml-4"
                on:change={handleToggle}
            />
        </label>
    </div>
</div>

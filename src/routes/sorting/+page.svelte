<script lang="ts">
    import { flip } from "svelte/animate";
    import { bubbleSort, selectionSort, insertionSort } from "$lib/algorithms/algorithm";
    import { selectedNode, stepNode, sortedArray, sortSpeed } from "../stores";
    import { generateUniqueRandomArray } from "$lib/helpers";

    let size: number = 30;
    let speed: any = 1000;
    let currentStep : any;
    let currentSelected : any;
    let arr = generateUniqueRandomArray();
    let sortedArr: any;
    let showValues: boolean = false;

    $: currentStep =  $stepNode;
    $: currentSelected = $selectedNode;
    $: speed = $sortSpeed;

    sortedArr = [...arr];

    function handleToggle() {
        showValues = !showValues;
    }

    function sizeChanged(size: number) {
        arr = generateUniqueRandomArray(size);
        sortedArr = [...arr];
    }

    function speedChanged(speed: number) {
        sortSpeed.update(() => speed);
    }


    function performAlgorithm(algorithm: string) {
        sortedArray.set(sortedArr);

        if (algorithm === "bubble") {
            bubbleSort()
        } else if (algorithm === "selection") {
            selectionSort()
        } else if (algorithm === "insertion") {
            insertionSort()
        }
    }

    // async function bubbleSort() {
    //     for (let i = 0; i < sortedArr.length - 1; i++) {
    //         for (let j = 0; j < sortedArr.length - i - 1; j++) {
    //             currentStep = j;
    //             currentSelected = j + 1;
    //             await delay(speed);
    //             if (sortedArr[j] > sortedArr[j + 1]) {
    //                 [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
    //             }
    //         }
    //     }
    //     currentStep = -1;
    //     currentSelected = -1;
    // }    

//    async function selectionSort() {
//         for (let i = 0; i < sortedArr.length - 1; i++) {
//             let minIndex = i;
//             for (let j = i + 1; j < sortedArr.length; j++) {
//                 currentStep = j;
//                 currentSelected = minIndex;
//                 await delay(speed);
//                 if (sortedArr[j] < sortedArr[minIndex]) {
//                     minIndex = j;
//                 }
//             }
//             [sortedArr[i], sortedArr[minIndex]] = [sortedArr[minIndex], sortedArr[i]];
//         }
//         currentStep = -1;
//         currentSelected = -1;
//     }

//     async function insertionSort() {
//         for (let i = 1; i < sortedArr.length; i++) {
//             let j = i - 1;
//             let key  = sortedArr[i];
//             while (j >= 0 && sortedArr[j] > key ) {
//                 currentStep = j;
//                 currentSelected = j + 1;
//                 await delay(speed);
//                 sortedArr[j + 1] = sortedArr[j];
//                 j--;
//             }
//             sortedArr[j + 1] = key ;
//         }
//         currentStep = -1;
//         currentSelected = -1;
//     }

    $: sizeChanged(size);
    
    
</script>

<style>
    .flip-transition {
        transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
        will-change: transform, opacity;
    }
</style>


<div class="flex flex-col items-center">
    <div class="flex flex-row overflow-x-auto h-48 flip-transition">
        {#each sortedArr as num, i (num + '-' + i)}
        <div
                class="flex flex-col items-center"
                style="margin-right: 1px;"
                animate:flip={{duration: 1000}}
            >
                <div
                    class="flex items-center justify-center rounded"
                    style="height: {25 + num}px; background-color: {i === currentStep || i === currentSelected ? 'green' : 'white'}; width: {(90 / sortedArr.length)}vw;"
                >
                    <!-- {num} -->
                </div>
                {#if showValues}
                <span>{num}</span>
                {/if}
            </div>
        {/each}
    </div>

    <div class="flex mt-8">
        <button on:click={() => performAlgorithm("bubble")} class="btn btn-primary mr-1">Bubble Sort</button>
        <button on:click={() => performAlgorithm("selection")} class="btn btn-primary mr-1">Selection Sort</button>
        <button on:click={() => performAlgorithm("insertion")} class="btn btn-primary mr-1">Insertion Sort</button>
        <button on:click={() => sortedArr = [...arr]} class="btn btn-primary mr-1">Reset</button>
        <button on:click={() => document.location.reload()} class="btn btn-secondary mr-1">New Array</button>
    </div>
    <input type="range" min="1" max="1000" bind:value={speed} on:change={() => speedChanged(speed)} class="range w-auto mt-8"/>
    <p>Speed: {speed}ms</p>

    <input bind:value={size} type="range" min="10" max="100" step="10"  class="range w-auto mt-8"/>
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

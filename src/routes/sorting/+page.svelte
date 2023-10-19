<script lang="ts">
    import { flip } from "svelte/animate";
    import { generateUniqueRandomArray } from "$lib/helpers";

    let size: number = 30;
    let speed: number = 1000;
    let currentStep : number;
    let currentSelected : number;
    let arr = generateUniqueRandomArray();
    let sortedArr: any;
    let showValues: boolean = false;

    async function delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleToggle() {
        showValues = !showValues;
    }

    function sizeChanged(size: number) {
        arr = generateUniqueRandomArray(size);
        sortedArr = [...arr];
    }

    async function bubbleSort() {
        for (let i = 0; i < sortedArr.length - 1; i++) {
            for (let j = 0; j < sortedArr.length - i - 1; j++) {
                currentStep = j;
                currentSelected = j + 1;
                await delay(speed);
                if (sortedArr[j] > sortedArr[j + 1]) {
                    [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
                }
            }
        }
        currentStep = -1;
        currentSelected = -1;
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
            [sortedArr[i], sortedArr[minIndex]] = [sortedArr[minIndex], sortedArr[i]];
        }
        currentStep = -1;
        currentSelected = -1;
    }

    async function insertionSort() {
        const sortableArr = sortedArr.map((num: any, id: any) => ({ num, id }));

        for (let i = 1; i < sortableArr.length; i++) {
            let j = i - 1;
            let key = sortableArr[i].num;

            while (j >= 0 && sortableArr[j].num > key) {
                currentStep = j;
                currentSelected = j + 1;
                sortableArr[j + 1] = sortableArr[j];
                j--;
            }

            sortableArr[j + 1] = { num: key, id: sortableArr[j + 1].id };

            sortedArr = sortableArr.map((item: any) => item.num);
            currentStep = -1;
            currentSelected = -1;
            await delay(speed);
        }
    }


    $: sizeChanged(size);
    
</script>


<div class="flex flex-col items-center">
    <div class="flex flex-row overflow-x-auto h-48 ">
        {#each sortedArr as num, i (num)}
            <div
                    class="flex flex-col items-center"
                    style="margin-right: 1px;"
                    animate:flip={{duration: 500}}
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
        <button on:click={bubbleSort} class="btn btn-primary mr-1">Bubble Sort</button>
        <button on:click={selectionSort} class="btn btn-primary mr-1">Selection Sort</button>
        <button on:click={insertionSort} class="btn btn-primary mr-1">Insertion Sort</button>
        <button on:click={() => sortedArr = [...arr]} class="btn btn-primary mr-1">Reset</button>
        <button on:click={() => document.location.reload()} class="btn btn-secondary mr-1">New Array</button>
    </div>
    <input type="range" min="1" max="1000" bind:value={speed} class="range w-auto mt-8"/>
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

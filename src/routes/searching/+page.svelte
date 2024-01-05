<script lang="ts">
    import { delay } from "$lib/helpers";
    import { text } from "@sveltejs/kit";

    let data = ["Apple" , "Banana" , "Cherry" , "Durian" , "Elderberry" , "Fig" , "Grape" , "Honeydew" , "Ice Cream Bean" , "Jackfruit" , "Kiwi" , "Lemon" , "Mango" , "Nectarine" , "Orange" , "Papaya" , "Quince" , "Raspberry" , "Strawberry" , "Tangerine" , "Ugli Fruit" , "Vanilla Bean" , "Watermelon" , "Xigua" , "Yuzu" , "Zucchini"];

    let selectedSearch: any = [
        {
            name: "Linear Search",
            timeComplexity: "O(n)",
            id: 1
        },
        {
            name: "Binary Search",
            timeComplexity: "O(log n)",
            id: 2
        },
        {
            name: "Jump Search",
            timeComplexity: "O(√n)",
            id: 3
        },
        {
            name: "Exponential Search",
            timeComplexity: "O(log n)",
            id: 4
        }
    ];

    let textArea: any;
    let searchTerm: any;
    let currentStep: any;
    let visited: any = [];
    let speed = 400;
    let selected: any = "Linear Search";
    let timeComplexity: string = ""; 
    let totaltJumps: number = visited.length;
    let isRunning: boolean = false;

    $: selectedSearch; // This reactive statement will track changes to selectedSearch
    $: {
        // Update the time complexity whenever selected or selectedSearch changes
        updateTimeComplexity();
    }

    $: {
        // Update the totaltJumps whenever visited changes
        totaltJumps = visited.length;
    }

    // A function to update the time complexity based on the selected algorithm
    function updateTimeComplexity() {
        const selectedAlgorithm = selectedSearch.find((item: any) => item.name === selected);
        if (selectedAlgorithm) {
            timeComplexity = selectedAlgorithm.timeComplexity;
        }
    }

    function addToList() {
        if (textArea == "" || textArea == null) {
            return;
        }
        
        data = [...data, textArea];
        textArea = "";
    }

    function removeFromList() {
        const index = data.indexOf(textArea);
        if (index !== -1) {
            data.splice(index, 1);
        }
        
        data = [...data];
        textArea = "";
    }

    function search() {
        isRunning = true;
        visited = [];
        currentStep = -1;
        totaltJumps = 0;

        if(selected == "Linear Search") {
            linearSort(searchTerm);
        } else if(selected == "Binary Search") {
            binarySort(searchTerm);
        } else if(selected == "Jump Search") {
            jumpSort(searchTerm);
        } else if(selected == "Exponential Search") {
            exponentialSort(searchTerm);
        }
    }

    async function linearSort(goal: any){
        if(data.includes(goal)) {
            for(let i = 0; i < data.length; i++) {
                visited = [...visited, i];
                currentStep = i;
                await delay(250);
                
                if (data[i] == goal) {
                    return i;
                }
            }
            return -1;
        }
    }

    async function binarySort(goal: any){
        if(data.includes(goal)) {
            let left = 0;
            let right = data.length - 1;
            let mid = Math.floor((left + right) / 2);

            while (left <= right) {
                visited = [...visited, mid];
                currentStep = mid;
                await delay(speed);

                if (data[mid] == goal) {
                    return mid;
                } else if (data[mid] < goal) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
                mid = Math.floor((left + right) / 2);
            }
            return -1;
        }
    }

    async function jumpSort(goal: any){
        if(data.includes(goal)) {
            let n = data.length;
            let step = Math.floor(Math.sqrt(n));
            let prev = 0;

            while (data[Math.min(step, n) - 1] < goal) {
                visited = [...visited, Math.min(step, n) - 1];
                currentStep = Math.min(step, n) - 1;
                await delay(speed);

                prev = step;
                step += Math.floor(Math.sqrt(n));
                if (prev >= n) {
                    return -1;
                }
            }

            while (data[prev] < goal) {
                visited = [...visited, prev];
                currentStep = prev;
                await delay(speed);
                
                prev++;
                if (prev == Math.min(step, n)) {
                    return -1;
                }
            }

            if (data[prev] == goal) {
                visited = [...visited, prev];
                currentStep = prev;
                return prev;
            }
            return -1;
        }
    }

    async function exponentialSort(goal: any){
        if(data.includes(goal)) {
            if (data[0] == goal) {
                return 0;
            }

            let i = 1;
            while (i < data.length && data[i] <= goal) {
                visited = [...visited, i];
                currentStep = i;
                await delay(speed);

                i = i * 2;
            }

            return binarySort(goal);
        }
    }
</script>

<div class="flex flex-col mx-auto gap-y-8 items-center h-screen justify-center relative">
    <div class="absolute top-0 left-0 right-0 text-center">
        <h1 class="text-5xl font-bold text-center mt-6">Searching Algorithms</h1>
        <h2 class="text-3xl font-bold mb-4 text-center mt-16">Time Complexity:</h2>
        <span class="text-red-600 text-4xl font-bold text-center">{timeComplexity}</span>
    </div>
    
    <div class="flex flex-col w-1/2">
        <div class="flex flex-wrap justify-center">
            {#each data as item, i (i)}
                <div class="bg-gray-600 p-2 m-1 rounded-md" style="background-color: {currentStep == i ? 'green' : visited.includes(i) ? 'green' : ''};">{item}</div>
            {/each}
        </div>
    </div>

    <div  class="flex space-x-2 ">
        <input type="text" class="p-2 rounded-md border w-80" bind:value={textArea} placeholder="Enter item" />
        
        <div class="flex space-x-2">
            <button class="p-2 btn btn-primary rounded-md" on:click={addToList}>Add</button>
            <button class="p-2 btn btn-primary rounded-md" on:click={() => data = []}>Clear</button>
            <button class="p-2 btn btn-secondary rounded-md" on:click={removeFromList}>Remove</button>
        </div>
    </div>

    <div class="flex space-x-2">
        <input type="text" class="p-2 rounded-md border " bind:value={searchTerm} placeholder="Search Term" />

        <select class="p-2 rounded-md border" bind:value={selected} on:change={updateTimeComplexity} >
            {#each selectedSearch as item, i (i)}
                <option value={item.name}>{item.name}</option>
            {/each}
        </select>
        
        <button class="p-2 btn btn-primary rounded-md" on:click={search}>Search</button>
        <button class="p-2 btn btn-secondary rounded-md" on:click={() => location.reload()}>Reset</button>

    </div>
    
    <span>Total Steps: <span style="color: {!isRunning ? 'red' : ''};">{isRunning ? totaltJumps : 'Not running'}</span></span>

</div>

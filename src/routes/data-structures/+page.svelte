<script lang="ts">
    import { flip } from "svelte/animate";
    
    let queue: any[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let stack: any[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let linkedList: any[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let newItemQueue: any;
    let newItemStack: any;
    let newItemLinkedList: any;

    function enqueue() {
      queue = [...queue, newItemQueue];
      newItemQueue = "";
    }

    function dequeue() {
      queue.shift();
      queue = [...queue];
    }

    function push() {
      stack = [...stack, newItemStack];
      newItemStack = "";
    }

    function pop() {
      stack.pop();
      stack = [...stack];
    }

    function insert() {
      linkedList = [...linkedList, newItemLinkedList];
      newItemLinkedList = "";
    }

    function remove() {
      linkedList.pop();
      linkedList = [...linkedList];
    }


  </script>
  
  <div class="p-4 border rounded-lg">
    <h2 class="text-xl font-semibold mb-2">Queue Visualizer</h2>
    <div class="space-x-2 flex">
      {#each queue as item, i (i)}
        <div animate:flip={{ duration: 1000 }} class="bg-gray-600 p-2 m-1 rounded-md">{item}</div>
      {/each}
    </div>
    <div class="mt-2">
        <input type="text" class="p-2 rounded-md border" bind:value={newItemQueue} placeholder="Enter item" />
        <button class="p-2 bg-blue-500 text-white rounded-md" on:click={enqueue}>Enqueue</button>
        <button class="p-2 bg-red-500 text-white rounded-md" on:click={dequeue}>Dequeue</button>
    </div>
      
    <h2 class="text-xl font-semibold mb-2 mt-2">Stack Visualizer</h2>
    <div class="space-x-2 flex">
      {#each stack as item, i (i)}
        <div animate:flip={{ duration: 1000 }} class="bg-gray-600 p-2 m-1 rounded-md">{item}</div>
      {/each}
    </div>
    <div class="mt-2">
        <input type="text" class="p-2 rounded-md border" bind:value={newItemStack} placeholder="Enter item" />
        <button class="p-2 bg-blue-500 text-white rounded-md" on:click={push}>Push</button>
        <button class="p-2 bg-red-500 text-white rounded-md" on:click={pop}>Pop</button>
    </div>

    <h2 class="text-xl font-semibold mb-2 mt-2">Linked List Visualizer</h2>
    <div class="space-x-2 flex">
      {#each linkedList as item, i (i)}
        <div animate:flip={{ duration: 1000 }} class="bg-gray-600 p-2 m-1 rounded-md">{item}</div>
      {/each}
    </div>
    <div class="mt-2">
        <input type="text" class="p-2 rounded-md border" bind:value={newItemLinkedList} placeholder="Enter item" />
        <button class="p-2 bg-blue-500 text-white rounded-md" on:click={insert}>Insert</button>
        <button class="p-2 bg-red-500 text-white rounded-md" on:click={remove}>Remove</button>
    </div>
  </div>
  
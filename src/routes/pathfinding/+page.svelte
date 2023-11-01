<script lang="ts">
    import { clearGrid } from "$lib/helpers";
    import { generateMaze } from "$lib/algorithms/maze-generators/DFS";
    import { aStar } from "$lib/algorithms/pathfinding/astar";

    const rows: number = 20;
    const cols: number = 20;
    let grid: App.Cell[][] = [];
    let stack: App.Cell[] = [];
    let disabled: boolean = false;
    let isFinished: boolean = false;
    let isInstant: boolean = false;
    let delayTime: number = 50;

    // Initialize grid
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let row: App.Cell[] = [];
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            row.push({
                visited: false,
                searched: false,
                lastChecked: false,
                walls: [true, true, true, true],
                position: [rowIndex, colIndex],
            });
        }
        grid.push(row);
    }

    function isStart(cell: App.Cell): boolean {
        return cell.position[0] === 0 && cell.position[1] === 0;
    }

    function isEnd(cell: App.Cell): boolean {
        return cell.position[0] === rows - 1 && cell.position[1] === cols - 1;
    }

    // Update grid function
    function updateGrid(newGrid: App.Cell[][]) {
        grid = newGrid;
    }

    async function handleMazeGeneration() {
        disabled = true;
        await generateMaze(grid, rows, cols, isInstant, delayTime, updateGrid);
        grid = [...grid];
        disabled = false;
        isFinished = true;
    }

    async function solveMaze() {
        disabled = true;
        await aStar(grid, rows, cols, isInstant, delayTime, updateGrid);
        disabled = false;
    }
</script>

<div class="justify-center align-middle mx-auto text-center mt-16">
    <h1 class="text-4xl font-bold mb-8">Pathfinding Visualizer</h1>

    <div>
        <button
            class="btn btn-primary"
            on:click={handleMazeGeneration}
            disabled={isFinished}>Generate Maze</button
        >
        <button
            class="btn btn-primary"
            on:click={solveMaze}
            disabled={!isFinished}>Solve Maze</button
        >

        <div class="form-control mt-8">
            <label class="label cursor-pointer justify-center">
                <span class="label-text">No Animation</span>
                <input
                    name="instant"
                    type="checkbox"
                    bind:checked={isInstant}
                    class="toggle toggle-accent ml-4"
                    {disabled}
                />
            </label>
        </div>
    </div>

    <div class="maze mt-8">
        {#each grid as row}
            {#each row as cell}
                <div
                    class="cell {cell.walls[0] ? '' : 'no-top'} {cell.walls[1]
                        ? ''
                        : 'no-right'} {cell.walls[2] ? '' : 'no-bottom'} {cell
                        .walls[3]
                        ? ''
                        : 'no-left'} {isStart(cell) && isFinished
                        ? 'start'
                        : ''} {isEnd(cell) && isFinished
                        ? 'end'
                        : ''} {cell.searched
                        ? 'searched'
                        : ''} {cell.lastChecked ? 'last-checked' : ''}"
                />
            {/each}
        {/each}
    </div>

    <div class="mt-8">
        <button class="btn btn-secondary" on:click={clearGrid}
            >Reset Maze</button
        >
    </div>
</div>

<style>
    .maze {
        display: grid;
        grid-template-columns: repeat(20, 20px);
    }

    .cell {
        width: 20px;
        height: 20px;
        border-style: solid;
        border-width: 1px;
        border-color: white;
    }

    .no-top {
        border-top: none;
    }

    .no-right {
        border-right: none;
    }

    .no-bottom {
        border-bottom: none;
    }

    .no-left {
        border-left: none;
    }

    .start:nth-child(1) {
        background-color: green;
    }

    .end:nth-child(400) {
        background-color: red;
    }

    .searched {
        background-color: blue;
    }

    .last-checked {
        background-color: lightcoral;
    }
</style>

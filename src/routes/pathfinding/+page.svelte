<script lang="ts">
    let disabled: boolean = false;

    type Cell = {
        visited: boolean;
        walls: boolean[];
        position: [number, number];
    };

    const rows: number = 20;
    const cols: number = 20;
    let grid: Cell[][] = [];
    let stack: Cell[] = [];

    // Initialize grid
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let row: Cell[] = [];
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            row.push({
                visited: false,
                walls: [true, true, true, true],
                position: [rowIndex, colIndex],
            });
        }
        grid.push(row);
    }

    // Promise-based setTimeout
    function delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // DFS algorithm to generate maze
    async function generateMaze(): Promise<void> {
        disabled = true;
        let current: Cell = grid[0][0];
        current.visited = true;
        stack.push(current);

        while (stack.length > 0) {
            let next: Cell | undefined = findNeighbor(current);

            if (next) {
                next.visited = true;
                removeWalls(current, next);
                stack.push(current);
                current = next;
                await delay(50);
                grid = [...grid];
            } else if (stack.length > 0) {
                current = stack.pop()!;
            }
        }
    }

    // Find a random unvisited neighbor
    function findNeighbor(cell: Cell): Cell | undefined {
        let neighbors: Cell[] = [];
        let [currentRow, currentCol] = cell.position;

        let directions: [number, number][] = [
            [currentRow - 1, currentCol], // Go up
            [currentRow, currentCol + 1], // Go right
            [currentRow + 1, currentCol], // Go down
            [currentRow, currentCol - 1], // Go left
        ];

        for (let [neighborRow, neighborCol] of directions) {
            if (
                neighborRow >= 0 &&
                neighborCol >= 0 &&
                neighborRow < rows &&
                neighborCol < cols &&
                !grid[neighborRow][neighborCol].visited
            ) {
                neighbors.push(grid[neighborRow][neighborCol]);
            }
        }

        if (neighbors.length > 0) {
            return neighbors[Math.floor(Math.random() * neighbors.length)];
        } else {
            return undefined;
        }
    }

    // Remove walls between two cells
    function removeWalls(a: Cell, b: Cell): void {
        let x = a.position[1] - b.position[1];
        let y = a.position[0] - b.position[0];

        if (x === 1) {
            a.walls[3] = false;
            b.walls[1] = false;
        } else if (x === -1) {
            a.walls[1] = false;
            b.walls[3] = false;
        }

        if (y === 1) {
            a.walls[0] = false;
            b.walls[2] = false;
        } else if (y === -1) {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }
</script>

<div class="justify-center align-middle mx-auto text-center mt-16">
    <div>
        <button class="btn btn-primary" on:click={generateMaze} {disabled}
            >Generate Maze</button
        >
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
                        : 'no-left'}"
                />
            {/each}
        {/each}
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
</style>

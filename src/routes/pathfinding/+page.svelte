<script lang="ts">
    const rows: number = 20;
    const cols: number = 20;
    let grid: App.Cell[][] = [];
    let stack: App.Cell[] = [];
    let disabled: boolean = false;
    let isFinished: boolean = false;
    let isInstant: boolean = false;

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

    function clearGrid(): void {
        document.location.reload();
    }

    function isStart(cell: App.Cell): boolean {
        return cell.position[0] === 0 && cell.position[1] === 0;
    }

    function isEnd(cell: App.Cell): boolean {
        return cell.position[0] === rows - 1 && cell.position[1] === cols - 1;
    }

    // Promise-based setTimeout
    function delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // DFS algorithm to generate maze
    async function generateMaze(): Promise<void> {
        isFinished = false;
        disabled = true;
        let current: App.Cell = grid[0][0];
        current.visited = true;
        stack.push(current);

        while (stack.length > 0) {
            let next: App.Cell | undefined = findNeighbor(current);

            if (next) {
                next.visited = true;
                removeWalls(current, next);
                stack.push(current);
                current = next;
                if (!isInstant) {
                    await delay(50);
                }
                grid = [...grid];
            } else if (stack.length > 0) {
                current = stack.pop()!;
            }
        }

        // Remove the entrance and exit walls in the generated maze
        grid[0][0].walls[0] = false;
        grid[rows - 1][19].walls[2] = false;
        grid = [...grid];
        disabled = false;
        isFinished = true;
    }

    // Find a random unvisited neighbor
    function findNeighbor(cell: App.Cell): App.Cell | undefined {
        let neighbors: App.Cell[] = [];
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
    function removeWalls(a: App.Cell, b: App.Cell): void {
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

    async function aStar(): Promise<void> {
        // Initialize the open and closed list
        let openList: App.Node[] = [];
        let closedList: Set<App.Cell> = new Set();
        let lastPathChangeNode: App.Node | null = null;

        // Heuristic function (Manhattan distance)
        const heuristic = (cell: App.Cell): number => {
            return (
                Math.abs(rows - 1 - cell.position[0]) +
                Math.abs(cols - 1 - cell.position[1])
            );
        };

        // Create start node and goal node
        let startNode: App.Node = {
            cell: grid[0][0],
            parent: null,
            pathChangeCounter: 0, 
            g: 0,
            h: heuristic(grid[0][0]),
            f: heuristic(grid[0][0]),
        };
        let goalNode: App.Cell = grid[rows - 1][cols - 1];

        // Add the start node
        openList.push(startNode);

        // Loop until you find the end
        while (openList.length > 0) {
            // Get the current node
            let currentNode = openList.reduce((a, b) => (a.f < b.f ? a : b));
            openList = openList.filter((n) => n !== currentNode);
            closedList.add(currentNode.cell);
            currentNode.cell.searched = true; // Mark as searched

            // Check if the path changed
            if (
                lastPathChangeNode &&
                lastPathChangeNode.pathChangeCounter !==
                    currentNode.pathChangeCounter
            ) {
                // Mark the last cell in the previous path
                lastPathChangeNode.cell.lastChecked = true;
            }
            lastPathChangeNode = currentNode;

            // Found the goal
            if (currentNode.cell === goalNode) {
                // Retrace path back to start
                let pathNode: App.Node | null = currentNode;
                while (pathNode != null) {
                    pathNode.cell.visited = true; // Mark path cell as visited
                    pathNode = pathNode.parent;
                }
                grid = [...grid];
                return;
            }

            // Generate children
            let children: App.Node[] = [];
            for (let [dy, dx] of [
                [-1, 0],
                [0, 1],
                [1, 0],
                [0, -1],
            ]) {
                let newRow = currentNode.cell.position[0] + dy;
                let newCol = currentNode.cell.position[1] + dx;

                // Make sure within range
                if (
                    newRow < 0 ||
                    newRow >= rows ||
                    newCol < 0 ||
                    newCol >= cols
                ) {
                    continue;
                }

                // Make sure walkable terrain
                let neighborCell = grid[newRow][newCol];
                if (
                    (currentNode.cell.walls[0] && dy === -1) ||
                    (currentNode.cell.walls[1] && dx === 1) ||
                    (currentNode.cell.walls[2] && dy === 1) ||
                    (currentNode.cell.walls[3] && dx === -1)
                ) {
                    continue;
                }

                // Create new node
                let newNode: App.Node = {
                    cell: neighborCell,
                    parent: currentNode,
                    pathChangeCounter: currentNode.pathChangeCounter + 1,
                    g: currentNode.g + 1,
                    h: heuristic(neighborCell),
                    f: currentNode.g + 1 + heuristic(neighborCell),
                };

                children.push(newNode);
            }

            // Loop through children
            for (let child of children) {
                // Child is on the closed list
                if (closedList.has(child.cell)) {
                    continue;
                }

                // Add the child to the open list
                openList.push(child);
            }

            if (!isInstant) {
                await delay(50);
            }
            grid = [...grid];
        }
    }
</script>

<div class="justify-center align-middle mx-auto text-center mt-16">
    <h1 class="text-4xl font-bold mb-8">Pathfinding Visualizer</h1>

    <div>
        <button
            class="btn btn-primary"
            on:click={generateMaze}
            disabled={isFinished}>Generate Maze</button
        >
        <button class="btn btn-primary" on:click={aStar} disabled={!isFinished}
            >Solve Maze</button
        >

        <div class="form-control mt-8">
            <label class="label cursor-pointer justify-center">
                <span class="label-text">No Animation</span>
                <input
                    name="instant"
                    type="checkbox"
                    bind:checked={isInstant}
                    class="toggle toggle-accent ml-4"
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
        background-color: lightcoral
    }
</style>

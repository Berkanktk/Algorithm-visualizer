import { delay } from "$lib/helpers";

export let rows: number;
export let cols: number;
export let grid: App.Cell[][];
export let isInstant: boolean;
export let stack: App.Cell[] = [];

// DFS algorithm to generate maze
export async function generateMaze(grid: App.Cell[][], rows: number, cols: number, isInstant: boolean, delayTime: number, updateFn: (newGrid: App.Cell[][]) => void): Promise<void> {
    let stack: App.Cell[] = [];
    let current = grid[0][0];
    current.visited = true;
    stack.push(current);

    while (stack.length > 0) {
        let next = findNeighbor(current, grid, rows, cols);

        if (next) {
            next.visited = true;
            removeWalls(current, next);
            stack.push(current);
            current = next;
            
            // Update the grid after each modification
            grid[current.position[0]][current.position[1]] = {...current};
            grid[next.position[0]][next.position[1]] = {...next};
            updateFn(grid.map(row => [...row]));

            if (!isInstant) {
                await delay(delayTime);
            }
        } else if (stack.length > 0) {
            current = stack.pop()!;
        }
    }

    // Remove the entrance and exit walls
    grid[0][0].walls[0] = false;
    grid[rows - 1][cols - 1].walls[2] = false;
    updateFn(grid.map(row => [...row]));
}

function findNeighbor(cell: App.Cell, grid: App.Cell[][], rows: number, cols: number): App.Cell | undefined {
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
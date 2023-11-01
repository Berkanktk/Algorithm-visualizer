import { delay } from "$lib/helpers";

export async function aStar(grid: App.Cell[][], rows: number, cols: number, isInstant: boolean, delayTime: number, updateFn: (newGrid: App.Cell[][]) => void): Promise<App.Cell[][]> {
    let openList: App.Node[] = [];
    let closedList: Set<App.Cell> = new Set();
    let lastPathChangeNode: App.Node | null = null;

    const heuristic = (cell: App.Cell): number => {
        return Math.abs(rows - 1 - cell.position[0]) + Math.abs(cols - 1 - cell.position[1]);
    };

    let startNode: App.Node = {
        cell: grid[0][0],
        parent: null,
        pathChangeCounter: 0,
        g: 0,
        h: heuristic(grid[0][0]),
        f: heuristic(grid[0][0]),
    };

    let goalNode: App.Cell = grid[rows - 1][cols - 1];
    openList.push(startNode);

    while (openList.length > 0) {
        let currentNode = openList.reduce((a, b) => (a.f < b.f ? a : b));
        openList = openList.filter(n => n !== currentNode);
        closedList.add(currentNode.cell);
        currentNode.cell.searched = true;

        if (lastPathChangeNode && lastPathChangeNode.pathChangeCounter !== currentNode.pathChangeCounter) {
            lastPathChangeNode.cell.lastChecked = true;
        }
        lastPathChangeNode = currentNode;

        if (currentNode.cell === goalNode) {
            let pathNode: App.Node | null = currentNode;
            while (pathNode) {
                pathNode.cell.visited = true;
                pathNode = pathNode.parent;
            }
            return grid;
        }

        let children = generateChildren(currentNode, grid, rows, cols, heuristic);

        for (let child of children) {
            if (!closedList.has(child.cell)) {
                openList.push(child);
            }
        }

        if (!isInstant) {
            await delay(delayTime);
            updateFn(grid.map(row => [...row]));
        }
    }

    return grid;
}

function generateChildren(node: App.Node, grid: App.Cell[][], rows: number, cols: number, heuristic: (cell: App.Cell) => number): App.Node[] {
    let children: App.Node[] = [];

    for (let [dy, dx] of [[-1, 0], [0, 1], [1, 0], [0, -1]]) {
        let newRow = node.cell.position[0] + dy;
        let newCol = node.cell.position[1] + dx;

        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
            continue;
        }

        let neighborCell = grid[newRow][newCol];
        if (isWallBetween(node.cell, neighborCell, dy, dx)) {
            continue;
        }

        let newNode: App.Node = {
            cell: neighborCell,
            parent: node,
            pathChangeCounter: node.pathChangeCounter + 1,
            g: node.g + 1,
            h: heuristic(neighborCell),
            f: node.g + 1 + heuristic(neighborCell),
        };

        children.push(newNode);
    }

    return children;
}

function isWallBetween(cellA: App.Cell, cellB: App.Cell, dy: number, dx: number): boolean {
    return (cellA.walls[0] && dy === -1) ||
        (cellA.walls[1] && dx === 1) ||
        (cellA.walls[2] && dy === 1) ||
        (cellA.walls[3] && dx === -1);
}

<script lang="ts">
    export let grid: App.Cell[][];
    export let isFinished: boolean;
    export let isStart: (cell: App.Cell) => boolean;
    export let isEnd: (cell: App.Cell) => boolean;
</script>

<div class="maze">
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
                    : ''} {cell.searched ? 'searched' : ''} {cell.lastChecked
                    ? 'last-checked'
                    : ''}"
            />
        {/each}
    {/each}
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

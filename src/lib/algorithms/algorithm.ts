import { delay } from "$lib/helpers";
import { selectedNode, stepNode, sortedArray, sortSpeed } from "../../routes/stores";
import { get } from "svelte/store";

let currentStep : any;
let currentSelected : any;
let sortedArr: any;
let speed: any;

$: currentStep = stepNode;
$: currentSelected = selectedNode;

sortedArray.subscribe((value) => {
    sortedArr = value;
});

sortSpeed.subscribe((value) => {
    speed = value;
});

export async function bubbleSort() {
    for (let i = 0; i < sortedArr.length - 1; i++) {
        for (let j = 0; j < sortedArr.length - i - 1; j++) {
            stepNode.set(j);
            selectedNode.set(j + 1);
            await delay(speed);
            if (sortedArr[j] > sortedArr[j + 1]) {
                [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
                sortedArray.set(sortedArr);
            }
        }
    }
    stepNode.set(-1);
    selectedNode.set(-1);
}

export async function selectionSort() {
    for (let i = 0; i < sortedArr.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < sortedArr.length; j++) {
            currentStep.set(j);
            currentSelected.set(minIndex);
            await delay(speed);
            if (sortedArr[j] < sortedArr[minIndex]) {
                minIndex = j;
            }
        }
        [sortedArr[i], sortedArr[minIndex]] = [sortedArr[minIndex], sortedArr[i]];
        sortedArray.set(sortedArr);
    }
    currentStep.set(-1);
    currentSelected.set(-1);
}

export async function insertionSort() {
    for (let i = 1; i < sortedArr.length; i++) {
        let j = i - 1;
        let key = sortedArr[i];
        while (j >= 0 && sortedArr[j] > key) {
            currentStep.set(j);
            currentSelected.set(j + 1);
            await delay(speed);
            sortedArr[j + 1] = sortedArr[j];
            j--;
            sortedArray.set(sortedArr);
        }
        sortedArr[j + 1] = key;
        sortedArray.set(sortedArr);
    }
    currentStep.set(-1);
    currentSelected.set(-1);
}
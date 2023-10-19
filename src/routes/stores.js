import { writable } from "svelte/store";
import { generateUniqueRandomArray } from "$lib/helpers";

export const stepNode = writable(-1);
export const selectedNode = writable(-1);
export const sortedArray = writable([]);
export const sortSpeed = writable(1000);
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Cell {
			visited: boolean;
			searched: boolean;
			lastChecked: boolean; 
			walls: boolean[];
			position: [number, number];
		};
	
		interface Node {
			cell: Cell;
			parent: Node | null;
			g: number;
			h: number;
			f: number;
			pathChangeCounter: number; 
		};
	}
}

export {};

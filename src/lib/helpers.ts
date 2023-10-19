export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateUniqueRandomArray(size: number = 30) {
    const uniqueSet = new Set();
    
    while (uniqueSet.size < size) {
        const randomNum = Math.floor(Math.random() * 100);
        uniqueSet.add(randomNum);
    }
    
    return Array.from(uniqueSet);
}
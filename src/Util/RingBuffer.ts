export default class RingBuffer<T> {
    private buffer: T[] = [];
    private readonly size: number;
    private idx: number = 0;

    constructor(size: number) {
        if (size < 1) {
            throw new RangeError("Size must be at least 1");
        }
        this.size = size;
    }

    public push(...vals: T[]): void {
        vals.forEach(obj => {
            this.buffer[this.idx] = obj;
            this.idx = (this.idx + 1) % this.size;
        });
    }

    public pop(): T {
        if (this.length() === 0) {
            throw new RangeError("Cannot pop empty buffer");
        }
        return this.buffer[this.idx];
    }

    public clear(): void {
        this.buffer = [];
        this.idx = 0;
    }

    public length(): number {
        return this.buffer.length;
    }
}
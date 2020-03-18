export function randFromEnum(e: any): any {
    const arr: any[] = Object.values(e);
    return arr[Math.floor((Math.random() * arr.length))];
}

export function rand<T>(e: T[]): T {
    if (Array.isArray(e)) {
        return e[Math.floor((Math.random() * e.length))];
    } else return undefined;
}

export interface SimplePoint2D {
    x: number,
    y: number
}

// for frame skip avoidance
export const frameEpsilon = 2;
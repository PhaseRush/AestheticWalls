export function randFromEnum(e: any): any {
    const arr: any[] = Object.values(e);
    return arr[Math.floor((Math.random() * arr.length))];
}

export function rand<T>(e: T[]): T {
    if (Array.isArray(e)) {
        return e[Math.floor((Math.random() * e.length))];
    } else return undefined;
}
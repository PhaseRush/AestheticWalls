import * as P5 from 'p5'

export class Star {
    private static _: P5;

    private readonly x: number;
    private readonly y: number;
    private readonly vy: number;
    private readonly sideLen: number;
    private readonly c: P5.Color;

    public static init(p5: P5) {
        console.log("set");
        Star._ = p5;
    }

    public static random() {
        let r: string = Math.floor(Star._.random(200, 255)).toString(16);
        let g: string = Math.floor(Star._.random(30, 150)).toString(16);
        let cs: string = "#" +
            (r.length === 1 ? '0' + r : r) +
            (g.length === 1 ? '0' + g : g) + "00";
        let c: P5.Color = Star._.color(cs);
        let len: number = Star._.random(0, 10);
        return new Star(Star._.random(0, Star._.width), 0, c, len, Math.pow(len, Star._.randomGaussian(1.2, 0.3)));
    }

    constructor(x: number, y: number, c: P5.Color, sideLen: number = 2, vy: number = 5) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.sideLen = sideLen;
        this.vy = vy;
    }

    public update() {
        this.move();
        this.draw()
    }

    private move() {
        this.y += this.vy;
        if (this.y > Star._.height) {
            this.y = 0;
        }
    }

    private draw() {
        Star._.fill(this.c);
        Star._.rect(this.x, this.y, this.sideLen, this.sideLen);
    }
}
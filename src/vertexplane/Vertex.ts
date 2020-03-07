import * as P5 from "p5";
import {randFromEnum} from "../Util/Util";

let _: P5;

enum Colors {
    TURQUOISE = "#05CDE4",
    GOLD = "#FFB804",
    MAGENTA = "#FF0354",
    GREY = "#31343e"
}

export class Vertex {
    private static readonly alpha = 90;
    private static readonly timeStep = 0.3;

    private _x;
    private _y;

    private readonly _r;
    private readonly _c: P5.Color;
    private readonly _cAlpha: string;

    private accY = Math.random() > 0.5 ? 1 : -1;
    private accX = Math.random() > 0.5 ? 1 : -1;

    static init(p: P5): void {
        _ = p;
    }

    public static createRandom(): Vertex {
        let c: P5.Color = randFromEnum(Colors);

        return new Vertex(
            _.random(0, _.width),
            _.random(0, _.height),
            _.random(3, 7),
            c,
            c.toString("#rrggbb") + Vertex.alpha.toString(16)
        );
    }

    constructor(x: number, y: number, r: number, c: P5.Color, cAlpha: string) {
        this._x = x;
        this._y = y;
        this._r = r;
        this._c = c;
        this._cAlpha = cAlpha;
    }

    public update() {
        this.move();
    }

    private move() {
        this._x = this._x + this.accX * Vertex.timeStep * (1 + Math.random() / 10.0);
        this._y = this._y + this.accY * Vertex.timeStep * (1 + Math.random() / 10.0);

        this.checkBounds();
    }

    private checkBounds() {
        if (this._y > _.height - this._r) this.accY = -1;
        if (this._y < 0 + this._r) this.accY = 1;
        if (this._x > _.width - this._r) this.accX = -1;
        if (this._x < 0 + this._r) this.accX = 1;
    }

    public render() {
        _.push();
        _.noStroke();
        _.fill(this._c);
        _.ellipse(this._x, this._y, this._r, this._r);
        _.pop();
    }

    public toString = (): string => {
        return "Vertex: x: " + this.x + "\ty: " + this.y;
    };

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get r() {
        return this._r;
    }

    get c(): P5.Color {
        return this._c;
    }

    get cAlpha(): string {
        return this._cAlpha;
    }
}
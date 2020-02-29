import * as P5 from "p5";
import {randFromEnum} from "./../Util/Util";

let _: P5;

enum Colors {
    TURQUOISE = "#05CDE5",
    GOLD = "#FFB803",
    MAGENTA = "#FF035B",
    GREY = "#3D3E3E"
}

export class Vertex {
    private static readonly alpha = 90;
    private static readonly timeStep = 0.01;

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

    constructor() {
        this._x = _.random(0, _.width);
        this._y = _.random(0, _.height);
        this._r = _.random(3, 7);
        this._c = randFromEnum(Colors);
        this._cAlpha = this.c.toString("#rrggbb") + Vertex.alpha.toString(16);
    }

    public render() {
        _.push();
        _.noStroke();
        _.fill(this._c);
        _.ellipse(this._x, this._y, this._r, this._r);
        _.pop();
    }

    public update() {
        this.move();
    }

    private move() {
        this._x = this._x + this.accX * Vertex.timeStep;
        this._y = this._y + this.accY * Vertex.timeStep;

        this.checkBounds();
    }

    private checkBounds() {
        if (this._y > _.height - this._r) this.accY = -1;
        if (this._y < 0 + this._r) this.accY = 1;
        if (this._x > _.width - this._r) this.accX = -1;
        if (this._x < 0 + this._r) this.accX = 1;
    }

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
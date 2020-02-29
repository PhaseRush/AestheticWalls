import * as P5 from "p5";
import * as util from "./../Util/Util"
import {rand} from "./../Util/Util";
import {sign} from "crypto";

let _: P5;

enum Colors {
    TURQUOISE = "#05CDE5",
    GOLD = "#FFB803",
    MAGENTA = "#FF035B",
    GREY = "#3D3E3E"
}

export class Vertex {
    private static readonly startStates: number[] = [0.05, -0.05];

    private readonly _vel: P5.Vector;
    private readonly _speed: number = rand(Vertex.startStates);

    private readonly _pos: P5.Vector;
    private readonly _colour: P5.Color;
    private radius: number = 4.0;

    private readonly _accX: P5.Vector;
    private readonly _accY: P5.Vector;

    static init(p: P5) {
        _ = p;
    }


    static create(): Vertex {
        return new Vertex(
            _.random(0, _.width),
            _.random(0, _.height),
            util.randFromEnum(Colors)
        )
    }

    constructor(x: number, y: number, colour: P5.Color) {
        this._pos = new P5.Vector().set(x, y);
        this._colour = colour;

        this._vel = new P5.Vector().set(rand(Vertex.startStates), rand(Vertex.startStates));

        this._accX = new P5.Vector().set(this._speed, 0.0);
        this._accY = new P5.Vector().set(0.0, this._speed);
    }

    public update(): void {
        this.move();
    }

    private move(): void {
        this.pos.add(this.vel);
        this.handleEdge();
    }

    // todo check math
    private handleEdge(): void {
        if (this.pos.x > _.width) {
            this.vel.set(-this._speed, this.vel.y);
        } else if (this.pos.x < 0) {
            this.vel.set(this._speed, this.vel.y);
        }

        if (this.pos.y > _.height) {
            this.vel.set(this.vel.x, -this._speed);
        } else if (this.pos.y < 0) {
            this.vel.set(this.vel.x, this._speed);
        }
    }

    // check if need push/pop
    public render(): void {
        _.push();
        _.noStroke();
        _.fill(this.colour);
        _.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
        _.pop();
    }

    get pos(): P5.Vector {
        return this._pos;
    }

    get vel(): P5.Vector {
        return this._vel;
    }

    get colour(): P5.Color {
        return this._colour;
    }
}
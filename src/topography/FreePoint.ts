import * as P5 from "p5";

let _: P5;

const Defaults = {
    "colour": null,
    "alpha": 200,
    "radius": 1
};

export class FreePoint {
    private static readonly noiseScale: number = 400.0;
    private static readonly border: number = 125.0;
    private static readonly epsilon: number = 0.01;
    private static allowOffScreen: boolean = true;
    // only matters for offscreen calculations when `allowOffscreen` is false
    private static offScreenThreshold: number = 200;

    private pos: P5.Vector;
    private dir: P5.Vector;
    private vel: P5.Vector;
    private speed: number = 1.0;

    private readonly _colourString: string;
    private readonly colour: P5.Color;
    private readonly radius: number;

    static init(p: P5, allowOffScreen: boolean = true): void {
        _ = p;
        this.allowOffScreen = allowOffScreen;
        Defaults.colour = _.color(255, 255, 255);
    }

    static create(colour: P5.Color = Defaults.colour,
                  alpha: number = Defaults.alpha,
                  radius: number = Defaults.radius): FreePoint {
        return new FreePoint(_.random(0, _.width), _.random(0, _.height), colour, alpha, radius);
    }

    constructor(x: number, y: number, colour: P5.Color, alpha: number, radius: number) {
        this.pos = new P5.Vector().set(x, y);
        this.dir = new P5.Vector().set(0, 0);
        this.vel = new P5.Vector().set(0, 0);
        this.radius = radius;
        // this._colourString = colour.toString("#rrggbb") + alpha.toString(16);
        this.colour = colour
    }

    public update(): void {
        this.move();
        this.render();
    }

    private move(): void {
        const angle: number = _.noise(this.pos.x / FreePoint.noiseScale,
            this.pos.y / FreePoint.noiseScale) * _.TWO_PI * FreePoint.noiseScale;

        this.dir.x = _.cos(angle);
        this.dir.y = _.sin(angle);
        this.vel = this.dir.copy();
        this.vel.mult(this.speed);
        this.pos.add(this.vel);

        this.speed = _.max(0.05, this.speed - FreePoint.epsilon); // maybe use https://p5js.org/examples/input-constrain.html
        this.handleEdge();
    }

    private handleEdge(): void {
        if (!FreePoint.allowOffScreen) {
            if (this.pos.x > _.width + FreePoint.offScreenThreshold ||
                this.pos.x < -FreePoint.offScreenThreshold ||
                this.pos.y > _.height + FreePoint.offScreenThreshold ||
                this.pos.y < -FreePoint.offScreenThreshold) {
                this.reset();
            }
        }
    }

    private reset(): void {
        this.pos.x = _.random(FreePoint.border, _.width);
        this.pos.y = _.random(FreePoint.border, _.height);
    }

    private render(): void {
        _.fill(this.colour)
        _.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    }

    get colourString(): string {
        return this._colourString;
    }
}
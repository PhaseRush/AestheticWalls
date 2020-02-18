import * as P5 from "p5";

let _: P5;

export class FreePoint {
    private static readonly noiseScale: number = 400.0;
    private static readonly border: number = 125.0;
    private static readonly epsilon: number = 0.01;

    private pos: P5.Vector;
    private dir: P5.Vector;
    private vel: P5.Vector;
    private speed: number = 1.0;

    static init(p: P5): void {
        _ = p;
    }

    static rand(): FreePoint {
        return new FreePoint(_.random(0, _.width), _.random(0, _.height));
    }

    constructor(x: number, y: number) {
        this.pos = new P5.Vector().set(x, y);
        this.dir = new P5.Vector().set(0, 0);
        this.vel = new P5.Vector().set(0, 0);
    }

    public move(): void {
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
        if (this.pos.x > _.width || this.pos.x < 0 || this.pos.y > _.height || this.pos.y < 0) {
            this.pos.x = _.random(FreePoint.border, _.width);
            this.pos.y = _.random(FreePoint.border, _.height);
        }
    }

    public render(radius: number): void {
        _.ellipse(this.pos.x, this.pos.y, radius, radius);
    }
}
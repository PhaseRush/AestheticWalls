import * as P5 from 'p5'

let _: P5;

const maxPoints: number = 400;
let isSlowStart: boolean = true;
const populationRate: number = 1; // the higher the slower. Only works with slowStart
let la: Array<FreePoint> = [];
let lb: Array<FreePoint> = [];
let lc: Array<FreePoint> = [];

let isLooping: boolean = false;

const colour: any = {
    A: P5.Color,
    B: P5.Color,
    C: P5.Color
};

const topography = function (p: P5) {
    p.setup = () => {
        _ = p;
        p.createCanvas(p.displayWidth, p.displayHeight);
        init(p);
    };

    function init(_: P5): void {
        _.background(0);
        _.frameRate(300);
        _.noStroke();
        _.smooth();

        // init colours
        colour.A = _.color(69, 33, 124);
        colour.B = _.color(7, 153, 242);
        colour.C = _.color(255, 255, 255);

        la = [];
        lb = [];
        lc = [];

        if (!isSlowStart) {
            for (let i = 0; i < maxPoints; i++) {
                la.push(FreePoint.rand());
                lb.push(FreePoint.rand());
                lc.push(FreePoint.rand());
            }
        }
    }

    p.draw = () => {
        _.background(0, 0, 0, 100);

        if (isSlowStart) {
            const currSize = la.length;
            if (currSize < maxPoints && _.frameCount % populationRate == 0) {
                la.push(FreePoint.rand());
                lb.push(FreePoint.rand());
                lc.push(FreePoint.rand());
            }
        }

        for (let i = 0; i < la.length; i++) {
            const radius: number = _.map(i, 0, maxPoints, 1, 2);
            const alpha: number = _.map(i, 0, maxPoints, 0, 200);

            update(la[i], radius, colour.A, alpha);
            update(lb[i], radius, colour.B, alpha);
            update(lc[i], radius, colour.C, alpha);
        }
    };

    p.keyPressed = () => {
        switch (_.keyCode) {
            case 'r'.toUpperCase().charCodeAt(0):
                init(_);
                break;
            case 'p'.toUpperCase().charCodeAt(0):
            case ' '.toUpperCase().charCodeAt(0):
                if (isLooping) {
                    isLooping = false;
                    _.noLoop();
                } else {
                    isLooping = true;
                    _.loop();
                }
                break;
        }
    };

    // p.mousePressed = () => {
    //
    // };


    function update(point: FreePoint, radius: number, color: P5.Color, alpha: number) {
        _.fill(color.toString("#rrggbb") + alpha.toString(16));
        point.move();
        point.render(radius);
    }
};

new P5(topography);

class FreePoint {
    private static readonly noiseScale: number = 400.0;
    private static readonly border: number = 125.0;
    private static readonly epsilon: number = 0.01;

    private pos: P5.Vector;
    private dir: P5.Vector;
    private vel: P5.Vector;
    private speed: number = 1.0;

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
import * as P5 from 'p5'
import {FreePoint} from "./FreePoint";

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

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        p.createCanvas(p.displayWidth, p.displayHeight);
        init(p);
        FreePoint.init(p);
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
            // la = Array(maxPoints).fill(null).map(FreePoint.rand);
            for (let i = 0; i < maxPoints; i++) {
                la.push(FreePoint.rand());
                lb.push(FreePoint.rand());
                lc.push(FreePoint.rand());
            }
        }
    }

    p.draw = () => {
        _.background(0, 0, 0, 5);

        if (isSlowStart) {
            const currSize = la.length;
            if (currSize < maxPoints && _.frameCount % populationRate == 0) {
                la.push(FreePoint.rand());
                lb.push(FreePoint.rand());
                lc.push(FreePoint.rand());
            }
        }

        for (let i = 0; i < la.length; i++) {
            const radius: number = _.map(i, 0, maxPoints, 1, 3);
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

    function update(point: FreePoint, radius: number, color: P5.Color, alpha: number) {
        _.fill(color.toString("#rrggbb") + alpha.toString(16));
        point.move();
        point.render(radius);
    }
});

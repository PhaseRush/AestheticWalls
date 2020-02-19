import * as P5 from 'p5'
import {FreePoint} from "./FreePoint";

let _: P5;

const maxPoints: number = 400;
let isSlowStart: boolean = true;
const populationRate: number = 1; // the higher the slower. Only works with slowStart
const blurAlpha: number = 1;
let pointsA: Array<FreePoint> = [];
let pointsB: Array<FreePoint> = [];
let pointsC: Array<FreePoint> = [];

let isLooping: boolean = false;

const Colour: any = {
    A: P5.Color,
    B: P5.Color,
    C: P5.Color
};

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        p.createCanvas(p.displayWidth, p.displayHeight);
        FreePoint.init(p);
        init(p);
    };

    function init(_: P5): void {
        _.background(0);
        _.frameRate(300);
        _.noStroke();
        _.smooth();

        // init colours
        Colour.A = _.color(69, 33, 124);
        Colour.B = _.color(7, 153, 242);
        Colour.C = _.color(255, 255, 255);

        pointsA = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.A));
        pointsB = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.B));
        pointsC = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.C));
    }

    p.draw = () => {
        _.background(0, 0, 0, blurAlpha);

        if (isSlowStart) {
            const currSize = pointsA.length;
            if (currSize < maxPoints && _.frameCount % populationRate == 0) {
                const radius = _.map(pointsA.length, 0, maxPoints, 1, 2);
                const alpha = _.map(pointsA.length, 0, maxPoints, 0, 200);
                pointsA.push(FreePoint.create(Colour.A, alpha, radius));
                pointsB.push(FreePoint.create(Colour.B, alpha, radius));
                pointsC.push(FreePoint.create(Colour.C, alpha, radius));
            }
        }

        _.fill(pointsA[0].colourString);
        pointsA.forEach(point => point.update());
        _.fill(pointsB[0].colourString);
        pointsB.forEach(point => point.update());
        _.fill(pointsC[0].colourString);
        pointsC.forEach(point => point.update());
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
});

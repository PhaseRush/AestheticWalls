import * as P5 from 'p5'
import {FreePoint} from "./FreePoint";

let _: P5;

let maxPoints: number;
const isSlowStart: boolean = true;
const allowOffScreen: boolean = true; // allows for prettier edges at the edge of screens
const populationRate: number = 1; // the higher the slower. Only works with slowStart
const blurAlpha: number = 1;
const autoReset: number = 300; // number of seconds between resets
const frameRate: number = 60;

let pointsA: Array<FreePoint> = [];
let pointsB: Array<FreePoint> = [];
let pointsC: Array<FreePoint> = [];

let isLooping: boolean = false;
let frameCount: number = 0;

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
        frameCount = 0;
        _.background(0);
        _.frameRate(frameRate);
        _.noStroke();
        _.smooth();
        maxPoints = _.width * _.height / 12384; // 1 point per 12384 pixels, aka 400 points per 3440 x 1440

        // init colours
        Colour.A = _.color(69, 33, 124);
        Colour.B = _.color(7, 153, 242);
        Colour.C = _.color(255, 255, 255);

        pointsA = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.A));
        pointsB = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.B));
        pointsC = isSlowStart ? [] : Array.from({length: maxPoints}, _ => FreePoint.create(Colour.C));
    }

    p.draw = () => {
        console.log(frameCount);
        if (frameCount++ >= frameRate * autoReset) {
            init(_);
            return;
        }
        _.background(0, 0, 0, blurAlpha);

        if (isSlowStart) {
            const currSize = pointsA.length;
            if (currSize < maxPoints && _.frameCount % populationRate == 0) {
                const radius = _.map(currSize, 0, maxPoints, 1, 2);
                const alpha = _.map(currSize, 0, maxPoints, 0, 200);
                pointsA.push(FreePoint.create(Colour.A, alpha, radius));
                pointsB.push(FreePoint.create(Colour.B, alpha, radius));
                pointsC.push(FreePoint.create(Colour.C, alpha, radius));
            }
        }

        pointsA.forEach(point => point.update());
        pointsB.forEach(point => point.update());
        pointsC.forEach(point => point.update());
    };

    // Key actions currently undetectable by P5 through Wallpaper Engine :(
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

import * as P5 from 'p5'
import {Star} from "../purityring/Star";

let _: P5;
let numStars: number = 1000;
let stars: Star[];

new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        init();
    };

    function init(): void {
        _.background("#000000");
        _.frameRate(60);
        _.noStroke();
        _.smooth();
        Star.init(_);

        stars = Array.from({length: numStars}, _ => Star.random());
    }

    p.draw = () => {
        _.background("rgba(0,0,0,0.35)")
        stars.forEach(s => s.update());
    };
});
import * as P5 from 'p5'
import {RingBuffer} from "../Util/RingBuffer";
import {DoublePendulum} from "./DoublePendulum";

let _: P5, r1: number, r2: number, m1: number, m2: number, a1: number, a2: number, a_v1: number, a_v2: number,
    cx: number, cy: number;

let nodeColor;
const histLength = 255;

const frameEpsilon = 2;

// trail history color
let historyColour: P5.Color;

let pendulum: DoublePendulum;


new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        _.background(0);
        _.frameRate(60);
        _.noStroke();
        _.smooth();
        init();
    };

    function init(): void {
        r1 = _.height / 5;
        r2 = _.height / 5;
        m1 = 20;
        m2 = 10;
        a1 = _.PI / _.randomGaussian(2, 0.4) * _.random([1, -1]);
        a2 = _.PI / _.randomGaussian(2, 0.4) * _.random([1, -1]);
        a_v1 = 0;
        a_v2 = 0;
        cx = _.width / 2;
        cy = _.height / 4;
        nodeColor = _.color("0xFFFFFF");
        historyColour = _.color(0xe0, 0x22, 0xba); // #e022ba

        pendulum = new DoublePendulum(
            _, 1, r1, r2, m1, m2, a1, a2, a_v1, a_v2, cx, cy, nodeColor, historyColour, histLength, true
        );
    }

    p.draw = () => {
        if (_.frameCount % (_.frameRate() * 120) < frameEpsilon) { // every 2 minutes
            init();
        }
        _.background(0);
        pendulum.update();
    };

});
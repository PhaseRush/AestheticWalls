import * as P5 from 'p5'
import {RingBuffer} from "../Util/RingBuffer";

let _: P5, r1: number, r2: number, m1: number, m2: number, a1: number, a2: number, a_v1: number, a_v2: number,
    cx: number, cy: number;

const g = 1;
let nodeColor;
const histLength = 255;
let history;

const frameEpsilon = 2;

// trail history color
let historyColour: P5.Color;


new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        init();
    };

    function init(): void {
        _.background(0);
        _.frameRate(60);
        _.noStroke();
        _.smooth();

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
        history = RingBuffer.fromArray([[10], [10]], histLength);
        historyColour = _.color(0xe0, 0x22, 0xba); // #e022ba
    }

    p.draw = () => {
        if (_.frameCount % (_.frameRate() * 60) < frameEpsilon) { // every minute
            init();
        }
        _.background(0);
        // a1 acceleration
        const numer1 = -g * (2 * m1 + m2) * _.sin(a1);
        const numer2 = -m2 * g * _.sin(a1 - 2 * a2);
        const numer3 = -2 * _.sin(a1 - a2) * m2;
        const numer4 = (a_v2 * a_v2) * r2 + (a_v1 * a_v1) * r1 * _.cos(a1 - a2);
        const denom = r1 * (2 * m1 + m2 - m2 * _.cos(2 * a1 - 2 * a2));
        const a1_a = (numer1 + numer2 + numer3 * numer4) / denom;

        // a2 acceleration
        const n1 = 2 * _.sin(a1 - a2);
        const n2 = (a_v1 * a_v1) * r1 * (m1 + m2);
        const n3 = g * (m1 + m2) * _.cos(a1);
        const n4 = (a_v2 * a_v2) * r2 * m2 * _.cos(a1 - a2);
        const den = r2 * (2 * m1 + m2 - m2 * _.cos(2 * a1 - 2 * a2));
        const a2_a = (n1 * (n2 + n3 + n4)) / den;

        // start rendering
        _.translate(cx, cy);
        _.stroke(255); // todo
        _.strokeWeight(5); // todo

        // transform to polar
        const x1 = r1 * _.sin(a1);
        const y1 = r1 * _.cos(a1);
        const x2 = x1 + r2 * _.sin(a2);
        const y2 = y1 + r2 * _.cos(a2);

        _.fill(nodeColor); // todo??
        _.ellipse(x1, y1, m1, m1);
        _.fill(nodeColor);
        _.ellipse(x2, y2, m2, m2);

        // draw the actual lines lmao
        _.fill(255);
        _.line(0, 0, x1, y1);
        _.fill(255);
        _.line(x1, y1, x2, y2);

        // update angles for next iter
        a_v1 += a1_a;
        a_v2 += a2_a;
        a1 += a_v1;
        a2 += a_v2;

        // draw history
        renderHistory(a2_a);

        // update history
        history.push([x2, y2]);
    };

    function renderHistory(a2_a: number) {
        for (let idx = 0; idx < history.getLength(); idx++) {
            // scale transparency based on index (0 max, size dim)
            let vec = history.get(idx);
            historyColour.setAlpha(_.max(idx, 20)); // clamp alpha
            _.fill(historyColour);
            _.strokeWeight(0);
            const radiusMultiplier: number = _.max(_.sqrt(_.abs(a2_a)), 1); // scale size based on a_a
            _.ellipse(vec[0], vec[1], m2 / radiusMultiplier, m2 / radiusMultiplier);
        }
    }

});
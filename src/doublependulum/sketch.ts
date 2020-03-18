import * as P5 from 'p5'
import {DoublePendulum,} from "./DoublePendulum";
import {frameEpsilon} from "../Util/Util";

let _: P5;
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
        const r1 = _.height / 5;
        const r2 = _.height / 5;
        const m1 = 20;
        const m2 = 10;
        const a1 = _.PI / _.randomGaussian(2, 0.4) * _.random([1, -1]);
        const a2 = _.PI / _.randomGaussian(2, 0.4) * _.random([1, -1]);
        const a_v1 = 0;
        const a_v2 = 0;
        const cx = _.width / 2;
        const cy = _.height / 4;
        const nodeColor = _.color("0xFFFFFF");
        const historyColour = _.color(0xe0, 0x22, 0xba); // #e022ba
        const histLength = 255;

        pendulum = new DoublePendulum(
            _, 1, r1, r2, m1, m2, a1, a2, a_v1, a_v2, cx, cy, nodeColor, historyColour, histLength,
            true, true, true
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
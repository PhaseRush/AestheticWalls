import * as P5 from 'p5'
import {RingBuffer} from "../Util/RingBuffer";

export class DoublePendulum {

    private readonly r1: number;
    private readonly g: number;
    private readonly r2: number;
    private readonly m1: number;
    private readonly m2: number;
    private a1: number;
    private a2: number;
    private a_v1: number;
    private a_v2: number;
    private readonly cx: number;
    private readonly cy: number;
    private readonly nodeColor: P5.Color;
    private readonly historyColor: P5.Color;
    private histLength: number = 255;
    private readonly _history: RingBuffer<number[]>;
    private readonly drawHistory: boolean;

    private _: P5;

    private tip: { x: number, y: number };

    constructor(p: P5, g: number, r1: number, r2: number, m1: number, m2: number, a1: number, a2: number, a_v1: number, a_v2: number,
                cx: number, cy: number, nodeColor: P5.Color, historyColor: P5.Color, histLength: number, drawHistory: boolean) {
        this._ = p;
        this.g = g;
        this.r1 = r1;
        this.r2 = r2;
        this.m1 = m1;
        this.m2 = m2;
        this.a1 = a1;
        this.a2 = a2;
        this.a_v1 = a_v1;
        this.a_v2 = a_v2;
        this.cx = cx;
        this.cy = cy;
        this.nodeColor = nodeColor;
        this.historyColor = historyColor;
        this.histLength = histLength;
        this.drawHistory = drawHistory;
        if (drawHistory) {
            this._history = RingBuffer.fromArray([[10], [10]], histLength);
        }
    }

    public update() {
        // a1 acceleration
        const numer1 = -this.g * (2 * this.m1 + this.m2) * this._.sin(this.a1);
        const numer2 = -this.m2 * this.g * this._.sin(this.a1 - 2 * this.a2);
        const numer3 = -2 * this._.sin(this.a1 - this.a2) * this.m2;
        const numer4 = (this.a_v2 * this.a_v2) * this.r2 + (this.a_v1 * this.a_v1) * this.r1 * this._.cos(this.a1 - this.a2);
        const denom = this.r1 * (2 * this.m1 + this.m2 - this.m2 * this._.cos(2 * this.a1 - 2 * this.a2));
        const a1_a = (numer1 + numer2 + numer3 * numer4) / denom;

        // a2 acceleration
        const n1 = 2 * this._.sin(this.a1 - this.a2);
        const n2 = (this.a_v1 * this.a_v1) * this.r1 * (this.m1 + this.m2);
        const n3 = this.g * (this.m1 + this.m2) * this._.cos(this.a1);
        const n4 = (this.a_v2 * this.a_v2) * this.r2 * this.m2 * this._.cos(this.a1 - this.a2);
        const den = this.r2 * (2 * this.m1 + this.m2 - this.m2 * this._.cos(2 * this.a1 - 2 * this.a2));
        const a2_a = (n1 * (n2 + n3 + n4)) / den;

        this._.translate(this.cx, this.cy);
        this._.stroke(255);
        this._.strokeWeight(5);

        const x1 = this.r1 * this._.sin(this.a1);
        const y1 = this.r1 * this._.cos(this.a1);
        const x2 = x1 + this.r2 * this._.sin(this.a2);
        const y2 = y1 + this.r2 * this._.cos(this.a2);

        this._.fill(this.nodeColor);
        this._.ellipse(x1, y1, this.m1, this.m1);
        this._.fill(this.nodeColor);
        this._.ellipse(x2, y2, this.m2, this.m2);

        this._.fill(255);
        this._.line(0, 0, x1, y1);
        this._.fill(255);
        this._.line(x1, y1, x2, y2);

        this.a_v1 += a1_a;
        this.a_v2 += a2_a;
        this.a1 += this.a_v1;
        this.a2 += this.a_v2;

        if (this.drawHistory) {
            this.renderHistory(a2_a);
            this._history.push([x2, y2]);
        }
        this.tip = {x: x2, y: y2};
        this._.translate(-this.cx, -this.cy);
    }

    private renderHistory(a2_a: number) {
        for (let idx = 0; idx < this._history.getLength(); idx++) {
            // scale transparency based on index (0 max, size dim)
            let vec = this._history.get(idx);
            this.historyColor.setAlpha(this._.max(idx, 20)); // clamp alpha
            this._.fill(this.historyColor);
            this._.strokeWeight(0);
            const radiusMultiplier: number = this._.max(this._.sqrt(this._.abs(a2_a)), 1); // scale size based on a_a
            this._.ellipse(vec[0], vec[1], this.m2 / radiusMultiplier, this.m2 / radiusMultiplier);
        }
    }

    get history(): RingBuffer<number[]> {
        return this._history;
    }

    public getTip(): { x: number, y: number } {
        return this.tip;
    }
}

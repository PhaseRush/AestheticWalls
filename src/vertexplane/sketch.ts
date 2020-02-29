import * as P5 from 'p5'
import {Vertex} from "./Vertex";

let _: P5;

let vertices: Vertex[];
let maxVertices: number = 100;
let distanceThreshold: number = 200;
const fillShape: boolean = true; // true for triangles, false for wireframe


new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        _.createCanvas(_.displayWidth, _.displayHeight);
        // _.createCanvas(1000, 300);
        Vertex.init(_);
        init();
    };

    function init(): void {
        _.background(0);
        _.frameRate(60);
        _.noStroke();
        _.smooth();

        maxVertices = Math.floor(_.width * _.height / 2E4);
        // console.log(maxVertices);
        distanceThreshold = Math.floor(_.width * _.height / 25000);
        // console.log(distanceThreshold);
        vertices = Array.from({length: maxVertices}, _ => Vertex.createRandom());
    }

    p.draw = () => {
        if (_.frameCount % 50 === 0) console.log("frameRate:\t" + _.frameRate());

        _.background(0);
        for (let i = 0; i < maxVertices; i++) {
            const v1: Vertex = vertices[i];
            v1.update();
            v1.render();

            for (let j = i + 1; j < maxVertices; j++) {
                const v2: Vertex = vertices[j];
                v2.update();
                const dist12: number = _.dist(v1.x, v1.y, v2.x, v2.y);

                // v1 and v2 eligible
                if (dist12 < distanceThreshold) {
                    for (let k = j + 1; k < maxVertices; k++) {
                        const v3: Vertex = vertices[k];
                        const dist23: number = _.dist(v2.x, v2.y, v3.x, v3.y);

                        // v3 eligible
                        if (dist23 < distanceThreshold) {
                            if (fillShape) {
                                _.stroke(255, 10);
                                _.fill(v3.cAlpha);
                            } else {
                                _.noFill();
                                _.strokeWeight(1);
                                _.stroke(200, 20);
                            }
                            // shape
                            _.beginShape(0x0004); // 4 ==="TRIANGLES" hardcoded because global const doesnt work
                            _.vertex(v1.x, v1.y);
                            _.vertex(v2.x, v2.y);
                            _.vertex(v3.x, v3.y);
                            _.endShape();
                        }
                        v3.update();
                    }
                }
            }
        }
    };
});
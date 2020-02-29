import * as P5 from 'p5'
import {Vertex} from "./Vertex";

let _: P5;

let vertices: Vertex[];
const maxVertices: number = 100;
const distanceThreshold: number = 50;
const fillShape: boolean = false;


new P5((p: P5) => {
    p.setup = () => {
        _ = p;
        //_.createCanvas(_.displayWidth, _.displayHeight);
        _.createCanvas(1000, 300);
        Vertex.init(_);
        init();
    };

    function init(): void {
        _.background(0);
        _.frameRate(60);
        _.noStroke();
        _.smooth();

        vertices = Array.from({length: maxVertices}, _ => Vertex.create());

    }

    p.draw = () => {
        _.background(0);
        for (let i = 0; i < maxVertices; i++) {
            const v1: Vertex = vertices[i];
            v1.update();
            v1.render();

            // if (i === 0) {
            //     console.log("len\t" + v1.vel.mag());
            // }

            for (let j = i + 1; j < maxVertices; j++) {
                const v2: Vertex = vertices[j];
                v2.update();
                const dist12: number = _.dist(v1.pos.x, v1.pos.y, v2.pos.x, v2.pos.y);

                // v1 and v2 eligible
                if (dist12 < distanceThreshold) {
                    for (let k = j + 1; k < maxVertices; k++) {
                        const v3: Vertex = vertices[k];
                        const dist23: number = _.dist(v2.pos.x, v2.pos.y, v3.pos.x, v3.pos.y);
                        if (dist23 < distanceThreshold) {
                            if (fillShape) {
                                _.stroke(255, 10);
                                _.fill(v3.colour); // todo add alpha maybe
                            } else {
                                _.noFill();
                                _.strokeWeight(1);
                                _.stroke(0, 20);
                            }
                            // shape
                            _.beginShape(0x0004); // hardcode because global const doesnt work
                            _.vertex(v1.pos.x, v1.pos.y);
                            _.vertex(v2.pos.x, v2.pos.y);
                            _.vertex(v3.pos.x, v3.pos.y);
                            _.endShape();
                        }
                        v3.update();
                    }
                }
            }
        }
    };
});
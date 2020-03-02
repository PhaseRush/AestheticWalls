import * as P5 from 'p5'
import {Vertex} from "./Vertex";
import createKDTree = require('../Util/kdtree');

let _: P5;

let vertices: Vertex[];
let coordinates: number[][] = [[], []]; // [x,y] for each vertex
let kdTree;
const kValue: number = 3; // 2 closest + self = 3

let maxVertices: number;
let distanceThreshold: number;
const density = 0.004; // decrease this number to make it more dense;

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
        _.frameRate(300);
        _.noStroke();
        _.smooth();

        maxVertices = Math.floor(_.width * _.height / (100 / density));
        console.log(maxVertices);
        distanceThreshold = Math.floor(_.width * _.height / (1/density));
        console.log(distanceThreshold);
        vertices = Array.from({length: maxVertices}, _ => Vertex.createRandom());
        updateKdTree();
    }

    function render(v1: Vertex, v2: Vertex, v3: Vertex) {
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

    p.draw = () => {
        if (_.frameCount % 50 === 0) console.log("frameRate:\t" + _.frameRate());
        updateKdTree();
        _.background(0);


        for (let i = 0; i < maxVertices; i++) {
            const v1: Vertex = vertices[i];
            v1.update();
            v1.render();

            // console.log("v1: " + v1.toString());
            const kIndices: number[] = kdTree.knn([v1.x, v1.y], kValue, distanceThreshold);
            //const v2: Vertex = vertices[kIndices[0]];
            //const v3: Vertex = vertices[kIndices[1]];
            // console.log("ret k length: " + kIndices.length);
            if (kIndices.length === kValue) { // ignore self
                const v_1: Vertex = vertices[kIndices[0]]; // repeat self?
                const v2: Vertex = vertices[kIndices[1]];
                const v3: Vertex = vertices[kIndices[2]];
                //console.log("tv2: " + v2.toString() + "\tv3: " + v3.toString());
                render(v_1, v2, v3);
            }
        }
    };

    // use index for loop over map due to performance
    function updateKdTree() {
        for (let i = 0; i < maxVertices; i++) {
            coordinates[i] = [vertices[i].x, vertices[i].y];
        }
        kdTree = createKDTree(coordinates);
    }
});
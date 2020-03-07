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

let maxAlphaDistance: number;
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
        distanceThreshold = Math.floor(_.width * _.height / (1 / density)) * 2;
        console.log(distanceThreshold);
        maxAlphaDistance = (1.0/2.0) * (distanceThreshold/ 100.0);
        vertices = Array.from({length: maxVertices}, _ => Vertex.createRandom());
        updateKdTree();
    }

    function determineColour(v1: Vertex, v2: Vertex, v3: Vertex): P5.Color {
        const dist12 = _.dist(v1.x, v1.y, v2.x, v2.y);
        const dist23 = _.dist(v2.x, v2.y, v3.x, v3.y);
        const dist13 = _.dist(v1.x, v1.y, v3.x, v3.y);

        const c1: P5.Color = _.color(v1.c);
        const c2: P5.Color = _.color(v2.c);
        const c3: P5.Color = _.color(v3.c);

        const colour12: P5.Color = _.lerpColor(c1, c2, 0.5);
        const colour23: P5.Color = _.lerpColor(c2, c3, 0.5);
        const colour13: P5.Color = _.lerpColor(c1, c3, 0.5);

        const colorPre: P5.Color = _.lerpColor(colour12, colour23,
            _.min(dist12, dist23) / _.max(dist12, dist23));
        const colorPost: P5.Color = _.lerpColor(colorPre, colour13,
            _.min(dist12 + dist23, dist13) / _.max(dist12 + dist23, dist13));
        // const area = _.sqrt(
        //     (dist12 + dist23 + dist13) *
        //     (((-1) * dist12) + dist23 + dist13) *
        //     (dist12 + ((-1) * dist23) + dist13) *
        //     (dist13 + dist23 + ((-1) * dist13))) / 4;

        const longest = _.max([dist12, dist23, dist13]);
        const diff = _.abs(longest - maxAlphaDistance);
        const scaleDiff = _.map(diff, 0, maxAlphaDistance, 0, 254);
        colorPost.setAlpha(scaleDiff);
        //console.log("longest: " + longest + "diff: " + diff + "scaleDiff: " + scaleDiff);
        return colorPost;
    }

    function render(v1: Vertex, v2: Vertex, v3: Vertex) {
        if (fillShape) {
            _.stroke(255, 10);
            //_.fill(v3.cAlpha);
            _.fill(determineColour(v1, v2, v3));
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var p5 = require("p5");
var rotBox = function (p) {
    var strokeWeight = 150;
    var transX = 3000;
    var transY = 300;
    var transZBase = 1000;
    var squareSideBase = 1000;
    var wheelModifier = 1.0;
    var modifier = 1.0;
    var C;
    p.setup = function () {
        p.createCanvas(p.displayWidth, p.displayHeight, p.WEBGL);
        p.strokeWeight(strokeWeight * 2);
        C = 0;
    };
    p.draw = function () {
        var R = p.PI / 12 * modifier;
        p.clear();
        C++;
        p.rotateZ(R);
        p.rotateX(-R);
        p.rotateY(-R);
        p.translate(transX, transY, transZBase + (C % 8) * 100 / 8);
        for (var i = 0; i < 64; i++) {
            p.stroke(i * 8 * wheelModifier - C % 8);
            for (var j = 0; j < 15; j++) {
                p.square(-j * squareSideBase - (C * 3) % squareSideBase, 0, 750);
            }
            p.translate(0, 0, -100);
        }
    };
};
new p5(rotBox);
//# sourceMappingURL=RotBox.js.map
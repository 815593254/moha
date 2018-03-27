'use strict';
const express = require("express");
const fs = require("fs");

const MAX_FRAME = 360;
let frames = new Array(MAX_FRAME);
const timer = (ms) => new Promise(res => setTimeout(res, ms));

function plus1s(req, res, next) {
    if (!req.header("User-Agent").includes("curl")) {
        res.redirect("https://github.com/HFO4/plus1s.live");
        return;
    }
    let i = 1;
    let loop = 0;
    while (loop <= 20) {
        if (i == MAX_FRAME) {
            i = 0;
            loop++;
        }
        write(frames[i]);
    }
    write("You've waste too much time, we have to stop you.");
    if (next) {
        next();
    }
}

function write(res, str) {
    res.write(str);
    res.write("\\033[2J\\033[H");
    timer(100).then(_ => res.flushHeaders());
}

function prepare() {
    console.log("Prepare frames...");
    for (let i = 0; i < MAX_FRAME; i++) {
        let buf = fs.readFileSync("pic/" + (i + 1).toString().padStart(3, '0') + ".txt");
        if (!buf) {
            frames[i] = buf.toString();
        }
    }
    console.log("Frames are ready.");
}

function main() {
    prepare();
    console.log("Ready to start server");
    let app = express();
    app.use('/', plus1s);
    app.listen(1926).on('error', console.log);
}

main();

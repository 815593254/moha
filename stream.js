const express = require("express");
const fs = require("fs");

const MAX_FRAME = 360;
let frames = new Array(MAX_FRAME);

function plus1s(req, res, next) {
    if (!req.header("User-Agent").includes("curl")) {
        res.redirect("https://github.com/HFO4/plus1s.live");
        return;
    }
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff'});
    let i = 1;
    let loop = 0;
    var io = setInterval(function () {
        if (i == MAX_FRAME) {
            i = 0;
            loop++;
        }
        write(res, frames[i]);
        i++;
        if (loop >= 20) {
            res.end("\nYou've waste too much time, we have to stop you.\n");
            clearInterval(io);
        }
    }, 100);
    if (next) {
        next();
    }
}

function write(res, str) {
    res.write(str);
    res.write("\033[2J\033[H");    
}

function prepare() {
    console.log("Prepare frames...");
    for (let i = 0; i < MAX_FRAME; i++) {
        let buf = fs.readFileSync("pic/" + (i + 1).toString().padStart(3, '0') + ".txt");
        if (buf) {
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

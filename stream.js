/*
* Wroning!
* 警告！
* 暴力预警
* 膜法预警
* 非战斗人员迅速撤离
*/



const express = require("express");
const fs = require("fs");

const MAX_FRAME = 360;
let frames = new Array(MAX_FRAME);
let i = 1;
function plus1s(req, res, next) {
    if (i == MAX_FRAME) {
        i = 0;
    }    
    res.set({
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin':'*'});
    res.send(frames[i]);
    i++;
}

function write(res, str) {
    res.write(str);
    res.write("\033[2J\033[H");    
}

function index(req,res,next){
    res.set({'Access-Control-Allow-Origin':'*'});
    fileName =  __dirname + '/moha.html';
    res.sendFile(fileName);
}

function saobo(req,res,next){
    fileName =  __dirname + '/src/saobo.html';
    res.sendFile(fileName);
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
    app.use('/moha', plus1s);
    app.use('/', index);
    app.use('/saobo',saobo);
    app.listen(1926).on('error', console.log);
}

main();

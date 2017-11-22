/*
--topLeft X:Y
--bottomRight X:Y
--dir path

// https://codereview.stackexchange.com/questions/122808/node-js-parallel-file-download-the-es6-way
 */
"use strict";
const http = require('http');
const fs = require('fs');
const sprintf = require('sprintf-js').sprintf;

const async = require('async');
const core = require('./core.js');

const MAX_PARALLEL_DOWNLOADS = 8;

// ARGV
const storepath = process.argv[2] || '.';
const zoom = process.argv[3] || 12;

const top_left_lon = 30.175;        // left (Osmosis Copy )
const top_left_lat = 60.0145;       // top
const bottom_right_lon = 30.5688;   // right
const bottom_right_lat = 59.8389;   // bottom

let top_left_x = core.long2tile(top_left_lon, zoom);
let top_left_y = core.lat2tile(top_left_lat, zoom);
let bottom_right_x = core.long2tile(bottom_right_lon, zoom);
let botton_right_y = core.lat2tile(bottom_right_lat, zoom);

console.log('generating...');

let all_urls = core.generate_urls_list(storepath, top_left_x, top_left_y, bottom_right_x, botton_right_y, zoom);
let total_files = all_urls.length;

console.log(total_files + ' urls generated.');

let current_file = 0;

console.log('downloading...');

async.eachLimit(
    all_urls,
    MAX_PARALLEL_DOWNLOADS,
    (record, next) => {

        core.download(
            record.url,
            record.filename,
            next,
            current_file, total_files
        );
        current_file++;
    }
    ,
    () => {
        console.log("Finished downloading, " + current_file + " files written (of " + total_files + ").");

    }
);


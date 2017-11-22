"use strict";

!function () {
    const sprintf = require('sprintf-js').sprintf;
    const http = require('http');
    const fs = require('fs');

    let urls = [
        'http://a.tile.openstreetmap.org/%3$s/%1$s/%2$s.png',
        'http://b.tile.openstreetmap.org/%3$s/%1$s/%2$s.png',
        'http://c.tile.openstreetmap.org/%3$s/%1$s/%2$s.png'
    ];

    var long2tile = function (lon, zoom) {
        return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
    };

    var lat2tile = function (lat, zoom) {
        return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
    };

    var download = (url, dest, next, current_file, total_files) => {

        // console.log(`Downloading ${url} to ${dest}`);
        console.log(`[${current_file}/${total_files}] Downloading ${url}... `);

        const file = fs.createWriteStream(dest);
        http.get(url, (response) => {
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                next();
            });
        });
    };

    var generate_urls_list = function (storepath, top_left_x, top_left_y, bottom_right_x, botton_right_y, zoom) {
        let server = 0;
        let all_urls = [];

        for (let x = top_left_x; x <= bottom_right_x; x++) {
            for (let y = top_left_y; y <= botton_right_y; y++) {

                let url = sprintf(urls[server], x, y, zoom);
                let filename = storepath + sprintf("tile_%1$s_%2$s_%3$s.png", zoom, x, y);

                all_urls.push({
                    'url'       : url,
                    'filename'  : filename
                });

                server = ++server % urls.length;
            }
            console.log('X = ' + x + ' / ' + bottom_right_x + ' with ' + (botton_right_y - top_left_y + 1) + ' files.');
        }

        return all_urls;
    };

    if (typeof exports !== 'undefined') {
        exports['generate_urls_list'] = generate_urls_list;
        exports['long2tile'] = long2tile;
        exports['lat2tile'] = lat2tile;
        exports['download'] = download;
        // exports[''] = ;
        // exports[''] = ;
    }
}();


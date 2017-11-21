// рекурсивное чтение всех JPG-шек из указанного каталога
// спиннер, синхронное чтение, вывод в файл
// CSV-вывод
"use strict"

const FS = require('fs');
const PATH = require('path');
const ExifImage = require('kinda-exif').ExifImage;
const sprintf = require('./kw.sprintf').sprintf;

var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
}

var exif_parse_gps = function( exif ) {
    const nogps = {
        'lat' : '-',
        'lon' : '-',
        'alt' : '-',
        'dir' : '-'
    };
    let gps = exif.gps;
    if ( isEmpty(gps) ) {
        return nogps;
    }

    let lat = gps.GPSLatitude   || null;
    let lon = gps.GPSLongitude  || null;

    if (!lat || !lon) {
        return nogps;
    }

    //Convert coordinates to WGS84 decimal
    let latRef = gps.GPSLatitudeRef || "N";
    let lonRef = gps.GPSLongitudeRef || "W";

    lat = ((3600 * lat[0] + 60 * lat[1] + lat[2])/3600) * (latRef == "N" ? 1 : -1);
    lon = ((3600 * lon[0] + 60 * lon[1] + lon[2])/3600) * (lonRef == "W" ? -1 : 1);

    let imgDir = gps.GPSImgDirection || NaN;

    let altRef = gps.GPSAltitudeRef || NaN;
    let alt = gps.GPSAltitude || 0;
    alt = gps.GPSAltitude * (altRef == 0 ? -1 : 1);

    // 'GPS: ' + gps.lat.paddingLeft("         ") + '/' + gps.lon.paddingLeft("         ") + '/' + gps.alt.paddingLeft("      ") + '/' + gps.dir.paddingLeft("       ")
    return {
        'lat' : lat.toFixed(5),
        'lon' : lon.toFixed(5),
        'alt' : (alt > 0 ? '+' : '') + alt.toFixed(0),
        'dir' : imgDir.toFixed(3)
    }
}

var process_argv = function () {
    if (process.argv.length <= 2) {
        console.log("Usage: " + __filename + " file.jpg ");
        process.exit(-1);
    }
    return process.argv[2];
}

String.prototype.paddingLeft = function (paddingValue) {
    return String(paddingValue + this).slice(-paddingValue.length);
};

const csv_head = "Maker;Model;Software;GPS LatLonAlt;Image Direction\n";
const csv_mask = "%s;%s;%s;%s/%s/%s;%s\n";

var format_log_line = function(line) {
    return sprintf(csv_mask, line.maker, line.model, line.software, line.gps_lat, line.gps_lon, line.gps_alt, line.gps_dir);
}

var compose_data_from_exif = function(meta) {
    let gps = exif_parse_gps(meta);
    let entry = {
        'maker'     : meta.image.Make       || 'n/a',
        'model'     : meta.image.Model      || 'n/a',
        'software'  : meta.image.Software   || 'n/a',
        'gps_lat'   : gps.lat,
        'gps_lon'   : gps.lon,
        'gps_alt'   : gps.alt,
        'gps_dir'   : gps.dir
    };
    return entry;
}

// ---- MAIN ----
let filename = process_argv();
let log = [];

try {
    let image = new ExifImage({ image: filename });
    console.log(image);
    if (image) {
        let meta = image.exifData;
        let entry = compose_data_from_exif(meta);
        // log.push(entry);
        console.log(meta);
    }
    image = null;
} catch (error) {
    // error.message
    console.log("\n" + error.message);
}



// write to file
/*
FS.appendFileSync(args.logfile, csv_head);
log.forEach( function(line) {
    FS.appendFileSync(args.logfile, format_log_line(line))
});
*/


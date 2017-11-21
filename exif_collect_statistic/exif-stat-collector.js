"use strict";
// рекурсивное чтение всех JPG-шек из указанного каталога
// спиннер, синхронное чтение, вывод в файл
// CSV-вывод

const FS = require('fs');
const PATH = require('path');
const ExifImage = require('kinda-exif').ExifImage;
const Spinner = require('./kw.spinner').Spinner;
const sprintf = require('./kw.sprintf').sprintf;

const walkSync = (d) => FS.statSync(d).isDirectory() ? FS.readdirSync(d).map(f => walkSync(PATH.join(d, f))) : d;
/* const walkSync = function(d) { FS.statSync(d).isDirectory ? FS.readdirSync(d).map(function(f) {walkSync(PATH.join(d, f))} ) : d; }; */

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
        console.log("Usage: " + __filename + " path/to/directory output.file");
        process.exit(-1);
    }
    let argv_path = process.argv[2];

    /*if ((argv_path.slice(-1) == '/') || (argv_path.slice(-1) == '\\')) {
        argv_path = argv_path.substring(0, argv_path.length - 1);
    }*/

    let ts = Date.now();
    return {
        input_path: argv_path,
        logfile: process.argv[3] || ts + '.csv',
        errfile: ts + '.log'
    };
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

var flatten_array = function(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten_array(toFlatten) : toFlatten);
    }, []);
};

// ---- MAIN ----
let args = process_argv();
let files_path = args.input_path;

console.log('Reading directory structure... ');
let files_list = walkSync( files_path );
    files_list = flatten_array(files_list);

let files_list_length = files_list.length;

console.log('Ok. Found average ' + files_list_length + ' entries.');

let total_files = 0;
let valid_files = 0;

let log = [];

// let spinner = new Spinner('[%1$s] : %2$s , total files: %3$s ');
let spinner = new Spinner('[%1$s] (%3$s/%4$s) %2$s %5$s');
    spinner.setSpinnerString("|/-\\");

console.log('Analyzing files... ');
files_list.forEach( function(fn) {
    total_files++;

    if (!/\.[J|j][P|p][E|e]?[G|g]$/.exec(fn)) {
        spinner.tick(fn, total_files, files_list_length, 'not a JPG file');
    } else {
        try {
            let image = new ExifImage({ image: fn });
            // Fix MEMORY overflow:
            // in ExifImage.prototype.extractExifEntry after entry{} definition add:
            // if (entry.components > 1000000) { throw new Error('Invalid `entry.component` count in EXIF data.'); return false; };

            if (image) {
                let meta = image.exifData;

                let entry = compose_data_from_exif(meta);

                log.push(entry);

                // spinner.tick(fn, total_files);
                spinner.tick(fn, total_files, files_list_length, ' ...');
                valid_files++;
            }
            image = null;
        } catch (error) {
            FS.appendFileSync(args.errfile, fn + ' ' + error.message + '\n');
            // error.message
            // console.log();
            // spinner.tick(fn, total_files + '  ' + error.message);
            // spinner.tick(fn, total_files);
        }
    }

});
spinner.stop();

console.log('\n\nWriting collected data to file ' + args.logfile);

// write to file
FS.appendFileSync(args.logfile, csv_head);
log.forEach( function(line) {
    FS.appendFileSync(args.logfile, format_log_line(line));
});


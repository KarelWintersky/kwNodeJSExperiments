cls

call wpack.cmd exif-stat-collector.js dist/exifstat.min.js
call uglifyjs dist/exifstat.min.js -o dist/exifstat.min.js

call wpack exif-file.js dist/exifgetfile.min.js 
call uglifyjs  dist/exifgetfile.min.js  -o  dist/exifgetfile.min.js 

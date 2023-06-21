const fs = require('fs');
const piexif = require('piexifjs');

/*
36867: DateTimeOriginal
36868: DateTimeDigitized
37521: SubsecTimeOriginal
37522: SubsecTimeDigitized
*/

//'2023:01:01 12:00:00'
//'2023:05:26 04:51:41'

const imagePath = 'JPEG-Filename-to-EXIF/images/20230526_045141.jpg';
const modifiedImagePath = 'JPEG-Filename-to-EXIF/images/modified.jpg';

const getBinaryDataFromJpegFile = (filename) => {
    return fs.readFileSync(filename).toString('binary');
}

const getExifFromJpegFile = (filename) => {
    return piexif.load(getBinaryDataFromJpegFile(filename));
}

const getJpegFileFromBinaryData = (base64String, filename) => {
    const imageBuffer = Buffer.from(base64String, 'binary');
    fs.writeFileSync(filename, imageBuffer);
}

const im = getExifFromJpegFile(imagePath);

im.Exif['36867'] = '2023:01:01 12:00:00';
im.Exif['36868'] = '2023:01:01 12:00:00';

const imDump = piexif.dump(im)

const temp = piexif.insert(imDump, getBinaryDataFromJpegFile(imagePath));
console.log(typeof temp);

getJpegFileFromBinaryData(temp, modifiedImagePath);

console.log('Complete');
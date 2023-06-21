const fs = require('fs');
const path = require('path');
const piexif = require('piexifjs');

/*
36867: DateTimeOriginal
36868: DateTimeDigitized
37521: SubsecTimeOriginal
37522: SubsecTimeDigitized
*/

//'2023:01:01 12:00:00'
//'2023:05:26 04:51:41'

const folderPath = 'JPEG-Filename-Date-Stamper/images/';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    const jpgFiles = files.filter(file => path.extname(file).toLowerCase() === '.jpg');

    jpgFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        updateImageExifData(filePath);
    });
});

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

const getNewTimestamp = (filepath) => {
    const filename = filepath.substring(filepath.lastIndexOf("\\") + 1);

    const year = filename.substring(0, 4);
    const month = filename.substring(4, 6);
    const day = filename.substring(6, 8);
    const hour = filename.substring(9, 11);
    const minute = filename.substring(11, 13);
    const second = filename.substring(13, 15);
    const newTimestamp = `${year}:${month}:${day} ${hour}:${minute}:${second}`;
    return newTimestamp;
}

const updateImageExifData = (imagePath) => {
    const exifData = getExifFromJpegFile(imagePath);
    
    const newTimestamp = getNewTimestamp(imagePath);
    
    exifData.Exif['36867'] = newTimestamp;
    exifData.Exif['36868'] = newTimestamp;
    
    const exifDump = piexif.dump(exifData)
    
    const temp = piexif.insert(exifDump, getBinaryDataFromJpegFile(imagePath));
    
    getJpegFileFromBinaryData(temp, imagePath);
}

console.log('Complete');

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Next Steps:
//      -Expand to include other naming formats
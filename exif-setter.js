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

    if (ss = filename.match(/\d{8}_\d{6}/g)) { // ISO 8601 (YYYYMMDD_HHMMSS)
        const year = ss[0].substring(0, 4);
        const month = ss[0].substring(4, 6);
        const day = ss[0].substring(6, 8);
        const hour = ss[0].substring(9, 11);
        const minute = ss[0].substring(11, 13);
        const second = ss[0].substring(13, 15);

        const newTimestamp = `${year}:${month}:${day} ${hour}:${minute}:${second}`;
        return newTimestamp;

    } else if (ss = filename.match(/\d{10}/g)) { // (MMDDYYHHMM)
        const month = ss[0].substring(0, 2);
        const day = ss[0].substring(2, 4);
        let year = ss[0].substring(4, 6);
        const hour = ss[0].substring(6, 8);
        const minute = ss[0].substring(8, 10);

        if (year > 50) {
            year = `19${year}`;
        } else {
            year = `20${year}`;
        }

        const newTimestamp = `${year}:${month}:${day} ${hour}:${minute}:00`;
        return newTimestamp;

    } else {
        console.error('Filename does not match any expected format:', filename);
        return null;
    }
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

console.log('Complete');

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Next Steps:
//      -Implement a way to select a folder to process
//      -Implement a GUI for a more user-friendly interaction with the program
//      -Implement a way to select a date format

import EXIF = require("./Interfaces/EXIF");
import FS = require("./Interfaces/FS");
import Path = require("./Interfaces/Path");
import Piexif = require("./Interfaces/Piexif");

const fs: FS = require('fs');
const path: Path = require('path');
const piexif: Piexif = require('piexifjs');

/*
36867: DateTimeOriginal
36868: DateTimeDigitized
37521: SubsecTimeOriginal
37522: SubsecTimeDigitized
*/

//'2023:01:01 12:00:00'
//'2023:05:26 04:51:41'

const folderPath: string = 'JPEG-Filename-Date-Stamper/images/';

// Utility Functions

const getBinaryDataFromJpegFile = (filename: string): string => {
    return fs.readFileSync(filename).toString('binary');
}

const getExifFromJpegFile = (filename: string): EXIF => {
    return piexif.load(getBinaryDataFromJpegFile(filename));
}

const getJpegFileFromBinaryData = (binaryString: string, filename: string): void => {
    const imageBuffer: Buffer = Buffer.from(binaryString, 'binary');
    fs.writeFileSync(filename, imageBuffer);
}

////////////////////////////////////////////////////////////////////////////////

const chunkArray = (array: string[], size: number): string[][] => {
    const chunks: string[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

const getNewTimestamp = (filepath: string): string | null => {
    const filename: string = filepath.substring(filepath.lastIndexOf("\\") + 1);

    let ss: RegExpMatchArray | null;
    if (ss = filename.match(/\d{8}_\d{6}/g)) { // ISO 8601 (YYYYMMDD_HHMMSS)
        const year = ss[0].substring(0, 4);
        const month = ss[0].substring(4, 6);
        const day = ss[0].substring(6, 8);
        const hour = ss[0].substring(9, 11);
        const minute = ss[0].substring(11, 13);
        const second = ss[0].substring(13, 15);

        const newTimestamp: string = `${year}:${month}:${day} ${hour}:${minute}:${second}`;
        return newTimestamp;

    } else if (ss = filename.match(/\d{10}/g)) { // (MMDDYYHHMM)
        const month = ss[0].substring(0, 2);
        const day = ss[0].substring(2, 4);
        let year = ss[0].substring(4, 6);
        const hour = ss[0].substring(6, 8);
        const minute = ss[0].substring(8, 10);

        if (Number(year) > 50) {
            year = `19${year}`;
        } else {
            year = `20${year}`;
        }

        const newTimestamp: string = `${year}:${month}:${day} ${hour}:${minute}:00`;
        return newTimestamp;

    } else {
        console.error('Filename does not match any expected format:', filename);
        return null;
    }
}

const updateImageExifData = (imagePath: string) => {
    return new Promise((resolve, reject) => {
        const exifData: EXIF = getExifFromJpegFile(imagePath);
        
        const newTimestamp = getNewTimestamp(imagePath);
        
        if (newTimestamp == null) {
            reject("No new timestamp found");
            return;
        }

        if (exifData.Exif == null) {
            exifData.Exif = {};
            reject("No Exif data found");
            return;
        }
        
        exifData.Exif['36867'] = newTimestamp;
        exifData.Exif['36868'] = newTimestamp;
        
        const exifDump: string = piexif.dump(exifData)
        
        const binaryData: string = piexif.insert(exifDump, getBinaryDataFromJpegFile(imagePath));
        
        getJpegFileFromBinaryData(binaryData, imagePath);

        resolve("Success!");
    });

}

const main = async () => {
    try {
        const concurrency: number = 100;
        
        const files: string[] = fs.readdirSync(folderPath);
        const jpgFiles: string[] = files.filter(file => path.extname(file).toLowerCase() === '.jpg');

        const chunks: string[][] = chunkArray(jpgFiles, concurrency); // Splits files into chunks
        for (const chunk of chunks) {
            const promises = chunk.map(file => {
                const filePath = path.join(folderPath, file);
                return updateImageExifData(filePath);
            });
            await Promise.all(promises);
        }
    } catch(err) {
        console.error('Error reading folder:', err);
        return;
    }

    console.log('Complete');
}

main();

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Next Steps:
//      -Implement a way to select a folder to process
//      -Implement a GUI for a more user-friendly interaction with the program
//      -Implement a way to select a date format

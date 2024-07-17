# JPEG Filename Date Stamper

This project is a utility to update the EXIF data of JPEG images based on their filenames. It uses the [Piexifjs](https://github.com/hMatoba/piexifjs) library to manipulate EXIF data.

## Features

- Extracts EXIF data from JPEG files.
- Updates the `DateTimeOriginal` and `DateTimeDigitized` EXIF fields based on the filename.
- Supports two filename formats for extracting dates:
  - `YYYYMMDD_HHMMSS`
  - `MMDDYYHHMM`

## Requirements

- Node.js

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd JPEG-Filename-Date-Stamper
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

3. Ensure the following interfaces are available in the `./Interfaces/` directory:
    - `EXIF.js`
    - `FS.js`
    - `Path.js`
    - `Piexif.js`

## Usage

1. Place your JPEG images in the `JPEG-Filename-Date-Stamper/images/` directory.

2. Run the script:
    ```sh
    node <script-filename>.js
    ```

## Script Overview

### Utility Functions

#### `getBinaryDataFromJpegFile(filename: string): string`

Reads the binary data from a JPEG file.

#### `getExifFromJpegFile(filename: string): EXIF`

Extracts the EXIF data from a JPEG file.

#### `getJpegFileFromBinaryData(binaryString: string, filename: string): void`

Writes binary data to a JPEG file.

#### `chunkArray(array: string[], size: number): string[][]`

Splits an array into smaller chunks of the specified size.

#### `getNewTimestamp(filepath: string): string | null`

Generates a new timestamp from the filename.

#### `updateImageExifData(imagePath: string): Promise<void>`

Updates the EXIF data of a JPEG file with a new timestamp.

### Main Function

The `main` function processes all JPEG files in the specified folder, updating their EXIF data based on their filenames.

## Future Additions

1. Implement a way to select a folder to process.
2. Implement a GUI for a more user-friendly interaction with the program.
3. Implement a way to select a date format.

## Known Issues

1. The script currently supports only specific filename formats for extracting dates. More formats might need to be added based on user needs.
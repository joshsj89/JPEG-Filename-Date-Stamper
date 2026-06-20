#!/bin/bash

FOLDER=$1

if [ $# -le 0 ]; then
  echo "Usage: $0 <folder>"
  echo "Example: $0 /path/to/photos"
  exit 1
fi

if [ ! -d "$FOLDER" ]; then
  echo "Error: Folder '$FOLDER' does not exist."
  exit 1
fi

if ! command -v exiftool &> /dev/null; then
  echo "Error: exiftool is not installed. Please install it and try again."
  exit 1
fi

echo "Processing files in '$FOLDER'..."

# Use exiftool to set the DateTimeOriginal, CreateDate, DateTimeDigitized, and ModifyDate tags based on the filename for all jpg and cr2 files in the folder and its subfolders
exiftool -r -overwrite_original \
-ext jpg \
"-DateTimeOriginal<FileName" \
"-CreateDate<FileName" \
"-DateTimeDigitized<FileName" \
"-ModifyDate<FileName" \
"$FOLDER"

echo "Done processing files in '$FOLDER'."
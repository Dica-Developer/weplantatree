#!/usr/bin/env bash

CURRENT_BRANCH_NAME=`git rev-parse --abbrev-ref HEAD`
FOLDER_NAME=./reports/$CURRENT_BRANCH_NAME/`(date +%Y)`/`(date +%m)`/`(date +%d)`/`(date +%H-%M-%S)`
REPORT_FOLDER="./build/reports/allTests"

# create folder recursivly
mkdir -p $FOLDER_NAME

# check if folder is created otherwise exit
if [ ! -d "$FOLDER_NAME" ]; then
  echo "Folder \""$FOLDER_NAME"\" not created"
  exit 1;
fi

# cp reports into created folder
# check if report folder exists
if [ ! -d "$REPORT_FOLDER" ]; then
  echo "Test report folder not found"
  exit 1
fi

cp -R $REPORT_FOLDER/* $FOLDER_NAME

git add $FOLDER_NAME

# commit tests results
# TODO add travis build nr to commit msg
git commit -m "Added test results from"

# push report to gh-pages
git push origin $CURRENT_BRANCH_NAME:gh-pages

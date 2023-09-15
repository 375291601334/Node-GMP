const fs = require('fs');
const csv = require('csvtojson');
const { pipeline } = require('stream');

const inputFile = './assets/booksCatalogue.csv';
const outputFile = './assets/booksCatalogue.txt';

const inputStream = fs.createReadStream(inputFile);
const outputStream = fs.createWriteStream(outputFile);

const onFinish = (err) => {
  if (err) {
    console.error('Error: ', err);
  } else {
    console.log('Transformation is complete!');
  }
};

pipeline(inputStream, csv({ checkType: true }), outputStream, onFinish);

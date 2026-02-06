import {executeRDSQuery} from '../rdsQueryExecutor.js';
import fs from 'fs';
import os from 'os';
const newline = os.EOL;

const outputFilePath = './assets/tblschool.csv';

const sqlQuery1 = `SELECT * FROM tblschool ORDER BY id ASC`; // Get school records

const TBLSCHOOL_SCHEMA = `id,schoolCode,schoolFullName,created,updated,created_at,updated_at`;

executeRDSQuery(sqlQuery1)
  .then((records) => {
      records.forEach(element => {
      console.log(`Recording current id ${element.id}`)
      const outputData = `${element.id},${element.schoolCode},${element.schoolFullName},${element.created},${element.updated},${element.created_at},${element.updated_at}${newline}`;
      fs.appendFileSync(outputFilePath, outputData, 'utf-8');
    });
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

  // executeRDSQuery(sqlQuery2)
  // .then((records) => {
  //   console.log('New account...');
  //   console.log(records);
  // })
  // .catch(error => {
  //   console.error('Error:', error.message);
  // });

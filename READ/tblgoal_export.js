import { executeRDSQuery } from '../rdsQueryExecutor.js';
import { GOAL_SUM } from './tbl_export_constants.js';
import fs from 'fs';
import os from 'os';
import * as fastcsv from 'fast-csv';
const outputFilePath = './assets/tblgoal.csv';

const TBLGOAL_SCHEMA = `id,section_id,title,description,index,professionalLearning,evidence,sipType,sipOther,keyAccountabilities,created,updated,type,strategies,created_at,updated_at`;

// Function to write the data to a CSV file
const writeToCSV = (rows) => {
  const newline = os.EOL;

  fs.appendFileSync(outputFilePath, newline); // Ensure a newline before appending

  const ws = fs.createWriteStream(outputFilePath, { flags: 'a' }); // 'a' means append mode
  
  // Initialize the CSV writer with column headers
  fastcsv
      .write(rows, { headers: false})
      .pipe(ws)
      .on('finish', () => {
          console.log(`Data successfully written to ${outputFilePath}`);
      });
};

function startReading(limit, offset) {
  const sqlQuery1 = `SELECT * FROM tblgoal ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`; // Get school records

  executeRDSQuery(sqlQuery1)
  .then((records) => {
      // Process results and write to CSV
      const rows = records.map(row => [row.id, row.section_id, row.title, 
                                        row.description, row.index, 
                                        row.professionalLearning, row.evidence, 
                                        row.sipType,
                                        row.sipOther, row.keyAccountabilities, 
                                        row.created, row.updated, row.type,
                                        row.strategies, row.created_at, 
                                        row.updated_at
                                      ]);
      writeToCSV(rows);
      console.log(`wrting data from page ${offset}`);

      // move to next page
      offset += 800;
      if (offset < GOAL_SUM){
        startReading(800, offset)
      }
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
}

startReading(800, 0)

  // executeRDSQuery(sqlQuery2)
  // .then((records) => {
  //   console.log('New account...');
  //   console.log(records);
  // })
  // .catch(error => {
  //   console.error('Error:', error.message);
  // });

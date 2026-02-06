import { executeRDSQuery } from '../rdsQueryExecutor.js';
import { PDPUSER_SUM } from '../READ/tbl_export_constans.js';
import fs from 'fs';
import os from 'os';
import * as fastcsv from 'fast-csv';
const outputFilePath = './assets/tblpdpuser.csv';

const TBLUSER_SCHEMA = `id,pdp_id,user_id,created,updated,created_at,updated_at,school_id,active,description,location,type,position,notes`;

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
  const sqlQuery1 = `SELECT * FROM tblpdpuser ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`; // Get school records

  executeRDSQuery(sqlQuery1)
  .then((records) => {
      // Process results and write to CSV
      const rows = records.map(row => [row.id, row.pdp_id, row.user_id, 
                                        row.created, row.updated, 
                                        row.created_at, row.updated_at, row.school_id,
                                        row.active, row.description, 
                                        row.location, row.type, row.position,
                                        row.notes]);
      writeToCSV(rows);
      console.log(`wrting data from page ${offset}`);

      // move to next page
      offset += 1000;
      if (offset < PDPUSER_SUM){  
        startReading(1000, offset)
      }
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
}

startReading(1000, 0)

  // executeRDSQuery(sqlQuery2)
  // .then((records) => {
  //   console.log('New account...');
  //   console.log(records);
  // })
  // .catch(error => {
  //   console.error('Error:', error.message);
  // });

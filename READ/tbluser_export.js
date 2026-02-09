import { executeRDSQuery } from '../rdsQueryExecutor.js';
import { USER_SUM } from './tbl_export_constants.js';
import fs from 'fs';
import os from 'os';
import * as fastcsv from 'fast-csv';
const outputFilePath = './assets/tbluser.csv';

const TBLUSER_SCHEMA = `id,staffIdentifier,staffSAPEmployeeIdentifier,staffDoEUserIdentifier,staffTitleTypeCode,staffGivenName,staffMiddleName,staffFamilyName,staffDoEEmailAddress,created,updated,staffPreferredName,lastLogin,active,isPrincipal,isTeachingStaff,isNonTeachingStaff,isDel,created_at,updated_at,last_login_at`;

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
  const sqlQuery1 = `SELECT * FROM tbluser ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`; // Get school records

  executeRDSQuery(sqlQuery1)
  .then((records) => {
      // Process results and write to CSV
      const rows = records.map(row => [row.id, row.staffIdentifier, row.staffSAPEmployeeIdentifier, 
                                        row.staffDoEUserIdentifier, row.staffTitleTypeCode, 
                                        row.staffGivenName, row.staffMiddleName, row.staffFamilyName,
                                        row.staffDoEEmailAddress, row.created, 
                                        row.updated, row.staffPreferredName, row.lastLogin,
                                        row.active, row.isPrincipal, row.isTeachingStaff,
                                        row.isNonTeachingStaff, row.isDel,
                                        row.created_at, row.updated_at,
                                        row.last_login_at]);
      writeToCSV(rows);
      console.log(`wrting data from page ${offset}`);

      // move to next page
      offset += 100;
      if (offset < USER_SUM){  
        startReading(100, offset)
      }
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
}

startReading(100, 0)

  // executeRDSQuery(sqlQuery2)
  // .then((records) => {
  //   console.log('New account...');
  //   console.log(records);
  // })
  // .catch(error => {
  //   console.error('Error:', error.message);
  // });

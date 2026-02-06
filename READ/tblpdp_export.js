import { executeRDSQuery } from '../rdsQueryExecutor.js';
import { PDP_SUM } from '../READ/tbl_export_constans.js';
import fs from 'fs';
import os from 'os';
import * as fastcsv from 'fast-csv';
const outputFilePath = './assets/tblpdp.csv';

const TBLSCHOOL_SCHEMA = `id,user_id,supervisor_id,year,yearSelected,onboardingComplete,midYearText,annualText,created,updated,active,type,finalComment,finalCommentLocked,pdpPrincipalComments,created_at,updated_at,owner_school_id,archived_at,archive_reason,date_commenced,date_completed`;

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
  const sqlQuery1 = `SELECT
  "id", "user_id", "supervisor_id", "year", "yearSelected", "onboardingComplete", "midYearText", "annualText", "created", "updated", "active", "type", "finalComment", "finalCommentLocked", "pdpPrincipalComments", "created_at", "updated_at", "owner_school_id", "archived_at", "archive_reason", "date_commenced", "date_completed"
  FROM tblpdp ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`; // Get school records

  executeRDSQuery(sqlQuery1)
  .then((records) => {
      // Process results and write to CSV
      const rows = records.map(row => [row.id, row.user_id, row.supervisor_id,
                                        row.year, row.yearSelected, row.onboardingComplete,
                                        row.midYearText, row.annualText, 
                                        row.created, row.updated,
                                        row.active, row.type, row.finalComment,
                                        row.finalCommentLocked, row.pdpPrincipalComments,
                                        row.created_at, row.updated_at,
                                        row.owner_school_id,
                                        row.archived_at, row.archive_reason,
                                        row.date_commenced, row.date_completed]);
      writeToCSV(rows);
      console.log(`wrting data from page ${offset}`);

      // move to next page
      offset += 100;
      if (offset < PDP_SUM){  
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

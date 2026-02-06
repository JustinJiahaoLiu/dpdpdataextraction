import { executeRDSQuery } from '../rdsQueryExecutor.js';
import { SECTION_SUM } from '../READ/tbl_export_constans.js';
import fs from 'fs';
import os from 'os';
import * as fastcsv from 'fast-csv';
const outputFilePath = './assets/tblsection.csv';

const TBLSECTION_SCHEMA = `id,pdp_id,sectionType,notifySupervisor,complete,supervisorComment,supervisor_id,supervisorSignTime,supervisorSignature,userComment,userSignTime,userSignature,created,updated,notifySupervisorTime,workLearningTheme_id,workLearningText,careerLearningTheme_id,careerLearningText,manager_id,managerSignTime,managerSignature,managerComment,principal_id,principalSignTime,principalSignature,principalComment,created_at,updated_at`;

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
  const sqlQuery1 = `SELECT * FROM tblsection ORDER BY id ASC LIMIT ${limit} OFFSET ${offset}`; // Get school records

  executeRDSQuery(sqlQuery1)
  .then((records) => {
      // Process results and write to CSV
      const rows = records.map(row => [row.id, row.pdp_id, row.sectionType, 
                                        row.notifySupervisor, row.complete, 
                                        row.supervisorComment, row.supervisor_id, 
                                        row.supervisorSignTime,
                                        row.supervisorSignature, row.userComment, 
                                        row.userSignTime, row.userSignature, row.created,
                                        row.updated, row.notifySupervisorTime, 
                                        row.workLearningTheme_id,
                                        row.workLearningText, row.careerLearningTheme_id,
                                        row.careerLearningText, row.manager_id,
                                        row.managerSignTime,row.managerSignature,
                                        row.managerComment,
                                        row.principal_id,row.principalSignTime,
                                        row.principalSignature,row.principalComment,
                                        row.created_at,row.updated_at]);
      writeToCSV(rows);
      console.log(`wrting data from page ${offset}`);

      // move to next page
      offset += 1000;
      if (offset < SECTION_SUM){
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

import AWS from 'aws-sdk';

const region = process.env.AWS_REGION;
const secretName = process.env.AWS_SECRET_NAME; // Replace with the name of your secret in Secrets Manager
const resourceArn = process.env.AWS_RESOURCE_ARN; // Replace with the Arn of your database
const clusterName = process.env.AWS_CLUSTER_NAME;  // Replace with the clusterName of your database
const databaseName = process.env.AWS_DATABASE_NAME;
let columnNames = [];

const secretsManager = new AWS.SecretsManager({
  region: region,
});

const rdsDataService = new AWS.RDSDataService({
  region: region,
});

const executeRDSQuery = async (sqlQuery) => {
  try {
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if (secretData.SecretString) {
      const { username, password } = JSON.parse(secretData.SecretString);

      const clusterArn = `arn:aws:rds:${region}:${resourceArn}:cluster:${clusterName}`;

      const params = {
        secretArn: secretData.ARN || '',
        resourceArn: clusterArn,
        sql: sqlQuery,
        includeResultMetadata: true,
        database: databaseName
      };

      const connection = await rdsDataService.executeStatement(params).promise();

      if (connection.columnMetadata) {
        columnNames = connection.columnMetadata.map(column => column.name);
      }
      
      
      if (connection.records){
        const records = connection.records.map(record => {
          const parsedRecord = {};
          record.forEach((value, index) => {
            parsedRecord[columnNames[index]] = value.stringValue || value.blobValue || value.booleanValue || value.doubleValue || value.longValue;

            if (value.isNull) {
              parsedRecord[columnNames[index]] = 'isNULL';
            }
          });
          return parsedRecord;
        });
  
        return records;
      }

      return connection;
      
    } else {
      console.error('No secret string found');
    }
  } catch (error) {
    console.error('Error fetching or executing SQL statement:', error);
  }
};

export {executeRDSQuery};
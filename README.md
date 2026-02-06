# dpdpdataextraction
#Data Extraction Instructions

1.Copy Template Files:
Copy the template files from assets/data extraction template/ to the assets/ directory so that column names can be added beforehand.
2.Install Dependencies:
From the root directory, run npm install to install all required dependencies.
3.Update Constants:
Use the SQL queries contained in the tbl_export_constants file to fetch the latest numbers from the database. Update each constant within the file accordingly.
4.Verify AWS Credentials:
Ensure your AWS credentials are valid and correctly configured in your .aws folder.
5.Extract Data:
Run the command node tblxxxx_export.js to extract the data as needed.
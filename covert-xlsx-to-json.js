const XLSX = require('xlsx');

// Load your workbook
const workbook = XLSX.readFile('C:\Users\micah\Desktop\Microsoft Secure Score NIS2 doc.xlsx');

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert the sheet to JSON
let data = XLSX.utils.sheet_to_json(sheet);

// Filter and map the data to include only necessary columns
data = data.map(row => ({
  RecommendedAction: row['Recommended action'],
  NIS2Score: row['NIS2 Score'],
  Article21: row['Article 21'],
  Rationale: row['Rationale'],
}));

// Save the JSON data to a file
const fs = require('fs');
fs.writeFileSync('nis2-data.json', JSON.stringify(data, null, 2), 'utf-8');

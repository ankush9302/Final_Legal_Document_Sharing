const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Process the data as needed
    console.log('Processed Excel data:', data);

    // Save the file to a permanent location
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const newFilePath = path.join(uploadDir, req.file.originalname);
    fs.renameSync(req.file.path, newFilePath);

    res.status(200).json({ message: 'Excel file uploaded and processed successfully' });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ message: 'Error processing Excel file' });
  }
};


const path = require('path');
const XLSX = require('xlsx');

exports.getDocumentLinks = async (req, res) => {
  try {
    // Read the Excel file
    const excelPath = path.join(__dirname, '..', 'FinalExceWithLink.xlsx');
    console.log('Excel path:', excelPath);
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const clientData = XLSX.utils.sheet_to_json(sheet);

    console.log('Raw Excel Data:', clientData[0]); // Log the first row of raw data

    // Map the data to match the frontend expectations
    const mappedData = clientData.map(client => {
      const mappedClient = {
        'CUSTOMER NAME': client['CUSTOMER NAME'],
        'MOBILE NUMBER': client[' BORRWER PHONE NUMBER '],
        'EMAIL ID': client[' BORRWER EMAIL ID '],
        'CUSTOMER ID': client['Final Loan ID'],
        'ZONE': client['ZONE'],
        'STATE': client['STATE'] || '',
        'documentLink': client[' Links ']
      };
      // console.log('Mapped Client:', mappedClient[0]); // Log each mapped client
      return mappedClient;
    });
    console.log('Mapped Data:', mappedData[0]); // Log the first row of mapped data
    res.status(200).json(mappedData);
  } catch (error) {
    console.error('Error reading document data:', error);
    let errorMessage = 'An unexpected error occurred while fetching document data.';
    
    if (error.code === 'ENOENT') {
      errorMessage = 'The Excel file could not be found. Please check if the file exists and the path is correct.';
    } else if (error instanceof XLSX.CFB$ParsingError) {
      errorMessage = 'The Excel file is corrupted or in an unsupported format. Please check the file and try again.';
    } else if (error.message.includes('Sheet')) {
      errorMessage = 'There was an issue with the Excel sheet. Please ensure the sheet name and structure are correct.';
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
const path = require('path');
const XLSX = require('xlsx');
const loanClient = require('../models/loanClients');

exports.getBatchClients = async (req, res) => {
  try {
    // Read the Excel file
    // const excelPath = path.join(__dirname, '..', 'uploads', 'updated_excel.xlsx');
    // console.log('Excel path:', excelPath);
    // const workbook = XLSX.readFile(excelPath);
    // const sheetName = workbook.SheetNames[0];
    // const sheet = workbook.Sheets[sheetName];
    // const clientData = XLSX.utils.sheet_to_json(sheet);

    // console.log('Raw Excel Data:', clientData[0]); // Log the first row of raw data

    // Function to find the actual column name
    // const findColumn = (obj, searchKey) => {
    //   searchKey = searchKey.toLowerCase().trim();
    //   return Object.keys(obj).find(key => key.toLowerCase().trim() === searchKey);
    // };

    // Map the data to match the frontend expectations
    // const mappedData = clientData.map(client => {
    //   const mappedClient = {
    //     'CUSTOMER NAME': client[findColumn(client, 'CUSTOMER NAME')],
    //     'MOBILE NUMBER': client[findColumn(client, 'BORRWER PHONE NUMBER')],
    //     'EMAIL ID': client[findColumn(client, 'BORRWER EMAIL ID')],
    //     'CUSTOMER ID': client[findColumn(client, 'Final Loan ID')],
    //     'ZONE': client[findColumn(client, 'ZONE')],
    //     'STATE': client[findColumn(client, 'STATE')] || '',
    //     'documentLink': client[findColumn(client, 'documentLink')]
    //   };
    //   return mappedClient;
    // });

      if(!req.params.batchId) {
        return res.status(400).json({ error: 'Batch ID is required.' });
      }

      const batchClients = await loanClient.find({ batchId: req.params.batchId });
      // const batchClients = await loanClient.find();
      if (!batchClients || batchClients.length === 0) {
        return res.status(404).json({ error: 'No clients found for this batch.' });
      }
      const mappedData = batchClients.map(client => ({
        clientId : client._id,
        batchId : client.batchId,
        'CUSTOMER NAME': client.customerName,
        'MOBILE NUMBER': client.borrowerPhoneNumber,
        'EMAIL ID': client.borrowerEmailId,
        'CUSTOMER ID': client.finalLoanId,
        'ZONE': client.zone,
        'STATE': client.state || '',
        'documentLink': client.documentLink
      }));

    res.status(200).json(mappedData);
  } catch (error) {
    console.error('Error reading document data:', error);
    let errorMessage = 'An unexpected error occurred while fetching document data.';
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

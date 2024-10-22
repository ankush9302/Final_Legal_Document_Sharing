const pdfProcessingService = require('../services/pdfProcessingService');
const excelService = require('../services/excelService');
const cloudinaryService = require('../services/cloudinaryService');

exports.uploadAndProcessFiles = async (req, res) => {
  try {
    // Extract the first PDF file from the request files
    const pdfFile = req.files.pdf[0];
    // Extract the first Excel file from the request files
    const excelFile = req.files.excel[0];

    // Process PDF
    const pdfPages = await pdfProcessingService.splitPdfIntoPages(pdfFile.path);

    // Upload PDF pages to Cloudinary
    const uploadedPages = await Promise.all(pdfPages.map(async (page) => {
      const cloudinaryUrl = await cloudinaryService.uploadFile(page.path);
      return { ...page, cloudinaryUrl };
    }));

    // Update Excel file with links
    const updatedExcelPath = await excelService.updateExcelWithLinks(excelFile.path, uploadedPages);

    // Read updated Excel data
    const excelData = await excelService.readExcelData(updatedExcelPath);

    res.status(200).json({
      message: 'Files processed and uploaded successfully',
      pages: excelData,
    });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Failed to process files', details: error.message });
  }
};

const pdfProcessingService = require('../services/pdfProcessingService');
const excelService = require('../services/excelService');
const cloudinaryService = require('../services/cloudinaryService');

exports.uploadAndProcessFiles = async (req, res) => {
  try {
    const pdfFile = req.files.pdf[0];
    const excelFile = req.files.excel[0];
    const pagesPerSplit = parseInt(req.body.pagesPerSplit, 10);

    // Process PDF
    // console.log("pdfFile", pdfFile);
    console.time();
    const pdfPages = await pdfProcessingService.splitPdfIntoPages(pdfFile.path, pagesPerSplit);
    console.log("pdfPages", pdfPages);
    

    // Upload PDF pages to Cloudinary
    const uploadedPages = await Promise.all(pdfPages.map(async (page) => {
      const cloudinaryUrl = await cloudinaryService.uploadFile(page.path);
      return { ...page, cloudinaryUrl };
    }));
    
    console.timeEnd();
    // console.log("uploadedPages",uploadedPages);
    // Update Excel file with links
    const updatedExcelPath = await excelService.updateExcelWithLinks(excelFile.path, uploadedPages);

    // Read updated Excel data
    const excelData = await excelService.readExcelData(updatedExcelPath);

    res.status(200).json({
      message: 'Files processed and uploaded successfully',
      // pages: excelData,
    });
  } catch (error) {
    console.error('Error processing files: in pdfProcessingController', error);
    res.status(500).json({ error: 'Failed to process files', details: error.message });
  }
};

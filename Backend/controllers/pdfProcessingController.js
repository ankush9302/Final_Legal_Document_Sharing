const pdfProcessingService = require('../services/pdfProcessingService');
const excelService = require('../services/excelService');
const cloudinaryService = require('../services/cloudinaryService');
const MongooseService=require("../models/MongoModel")

exports.uploadAndProcessFiles = async (req, res) => {
  try {
    //step 1: get the Data from request
    const pdfFile = req.files.pdf[0];
    const excelFile = req.files.excel[0];
    const pagesPerSplit = parseInt(req.body.pagesPerSplit, 10);

    //step 1.2 : upload the files to cloudinary to be stored in the database
    const pdfUrl = await cloudinaryService.uploadFile(pdfFile.path);
    const excelUrl = await cloudinaryService.uploadFile(excelFile.path);
    const BatchMongoInsertResult= await MongooseService.insertBatchUploadDetails(pdfFile.originalname, pdfUrl, excelFile.originalname,excelUrl,pagesPerSplit);
   console.log("the details of batch is",BatchMongoInsertResult)
    const {_id:batchId}=BatchMongoInsertResult;
    //Step 2: split pages into indivisual
    const pdfPages = await pdfProcessingService.splitPdfIntoPages(pdfFile.path, pagesPerSplit);

    const uploadedPages = await Promise.all(pdfPages.map(async (page) => {
      const cloudinaryUrl = await cloudinaryService.uploadFile(page.path);
      return { ...page, cloudinaryUrl };
    }));

    const updatedExcelPath = await excelService.updateExcelWithLinks(excelFile.path, uploadedPages);
    const sheetDataInJson= await excelService.readExcelData(updatedExcelPath);
    //there is unneccessary whitespace in keys to prevent errors reading it we are cleaning it 
    const cleanJsonData=[];
    sheetDataInJson.forEach((data)=>{
      const cleanedData = {}
      for (const [key, value] of Object.entries(data)) {
        const trimmedKey = key.trim().replace(/\s+/g, ' '); // Remove leading/trailing spaces and normalize multiple spaces
        cleanedData[trimmedKey] = value;
      }
       cleanJsonData.push(cleanedData)
    })

  //data each row of sheet to db
   const uploadToMongoClientResult=await MongooseService.UploadClientsOnMongo(cleanJsonData,batchId);
   console.log("uploaded to mongodb:legalClients",uploadToMongoClientResult);

    res.status(200).json({
      message: 'Files processed and uploaded successfully',
      // pages: excelData,
    });
  } catch (error) {
    console.error('Error processing files: in pdfProcessingController', error);
    res.status(500).json({ error: 'Failed to process files', details: error.message });
  }
};

const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-lib');
const cloudinary = require('../config/cloudinary');



//this is only in use 
exports.splitPdfIntoPages = async (pdfPath, pagesPerSplit) => {
  const pdfBuffer = await fs.readFile(pdfPath);
  // console.log("pdfBuffer",pdfBuffer);
  const pdfDoc = await pdf.PDFDocument.load(pdfBuffer);
  const pages = [];
  const totalPages = pdfDoc.getPageCount();
  // console.log("pdfdoc",pdfDoc);
  for (let i = 0; i < totalPages; i += pagesPerSplit) {
    const newPdf = await pdf.PDFDocument.create();
    const end = Math.min(i + pagesPerSplit, totalPages);
    const copiedPages = await newPdf.copyPages(pdfDoc, Array.from({ length: end - i }, (_, j) => i + j));
    // console.log("copiedPages",copiedPages);
    copiedPages.forEach((page) => {
      newPdf.addPage(page);
    });

    const pdfBytes = await newPdf.save();
    const pagePath = path.join(path.dirname(pdfPath), `split_${Math.floor(i / pagesPerSplit) + 1}.pdf`);
    await fs.writeFile(pagePath, pdfBytes);

    pages.push({ pageNumber: Math.floor(i / pagesPerSplit) + 1, path: pagePath });
  }

  return pages;
};

//not in use now
const extractContactInfo = (text) => {
  const singleLineText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ');

  const nameMatch = singleLineText.match(/MR\.\/MS\.([^-]+)/);
  const name = nameMatch ? nameMatch[1].trim() : null;

  const emailMatch = singleLineText.match(/MAILID([^-]+)/i);
  const email = emailMatch ? emailMatch[1].trim() : null;

  const phoneMatch = singleLineText.match(/MOB-(\d+)/);
  const phone = phoneMatch ? phoneMatch[1].trim() : null;

  return { name, email, phone };
};

const processPDF = async (pdfPath) => {
  const dataBuffer = await fs.readFile(pdfPath);
  const data = await pdf(dataBuffer);
  const numPages = data.numpages;
  const pagesInfo = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const pageText = await pdf(dataBuffer, { max: pageNum });
    const contactInfo = extractContactInfo(pageText.text);
    if (contactInfo.name || contactInfo.email || contactInfo.phone) {
      pagesInfo.push({ pageNum, contactInfo });
    }
  }

  return pagesInfo;
};

const uploadPageToCloudinary = async (pageBuffer) => {
  const result = await cloudinary.uploader.upload(pageBuffer, {
    folder: 'legal_documents',
    resource_type: 'auto',
  });
  return result.secure_url;
};

exports.processAndUploadPDF = async (pdfPath) => {
  const pagesInfo = await processPDF(pdfPath);
  const uploadedPages = [];

  for (const page of pagesInfo) {
    const cloudinaryUrl = await uploadPageToCloudinary(page);
    uploadedPages.push({ ...page, cloudinaryUrl });
  }

  return uploadedPages;
};
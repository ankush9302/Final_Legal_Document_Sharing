// Backend/services/excelService.js

const XLSX = require('xlsx');
const path = require('path');

exports.updateExcelWithLinks = async (excelPath, uploadedPages) => {
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet);

  data.forEach((row, index) => {
    const matchingPage = uploadedPages.find(page => page.pageNumber === index + 1);
    if (matchingPage) {
      row.documentLink = matchingPage.cloudinaryUrl;
    }
  });

  XLSX.utils.sheet_add_json(sheet, data);

  const updatedExcelPath = path.join(path.dirname(excelPath), 'updated_excel.xlsx');
  XLSX.writeFile(workbook, updatedExcelPath);

  return updatedExcelPath;
};

exports.readExcelData = async (excelPath) => {
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(sheet);
};


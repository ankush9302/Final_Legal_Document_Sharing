const loanClient=require("./loanClients")
const Batch = require('./Batches')
 class MongooseService {
    constructor() {
        this.connect();
        }
        //mapping json data from sheet to legalClientSchema
        static formatLoanClientData = (sheetDataInJson,batchId) => {
            return sheetDataInJson.map(entry => ({
                batchId:batchId,
                slNo: entry['Sl No'],
                clContractId: entry['CL CONTRACT ID'],
                lkLoanAccountId: entry['LK LOAN ACCOUNT ID'],
                finalLoanId: entry['Final Loan ID'],
                customerName: entry['CUSTOMER NAME'],
                lenderName: entry['LENDER NAME'],
                colendRatio: entry['COLEND RATIO'],
                zone: entry['ZONE'],
                state: entry['STATE'],
                location: entry['LOCATION'],
                ncm: entry['NCM'],
                zcm: entry['ZCM'],
                rcm: entry['RCM'],
                acm: entry['ACM'],
                cmInhouseTl: entry['CM / INHOUSE TL'],
                collCat: entry['COLL CAT'],
                resoStatus: entry['RESO STATUS'],
                resoRate: entry['RESO RATE'],
                currentDpd: entry['CURRENT DPD'],
                opnPos: entry['  OPN POS  '],
                currentMonthBestDispo: entry['CURRENT MONTH BEST DISPO'],
                workNonWork: entry['WORK/NON WORK'],
                lastMonthBestDispo: entry['LAST MONTH BEST DISPO'],
                borrowerName: entry['BORROWER NAME'],
                borrowerAddress: entry['BORROWER ADDRESS'],
                borrowerEmailId: entry['BORRWER EMAIL ID'],
                borrowerPhoneNumber: entry['BORRWER PHONE NUMBER'],
                coBorrowerName: entry['CO-BORROWER NAME'],
                coBorrowerAddress: entry['CO-BORROWER ADDRESS'],
                coBorrowerEmailId: entry['CO-BORRWER EMAIL ID'],
                coBorrowerPhoneNumber: entry['CO-BORRWER PHONE NUMBER'],
                lkOfficeAddress: entry['LK OFFICE ADDRESS'],
                lkContactPersonName: entry['LK CONTACT PERSON NAME'],
                lkContactPersonMobileNum: entry['LK CONTACT PERSON   MOBILE NUM.'],
                product: entry['PRODUCT'],
                loanAmount: entry['LOAN AMOUNT'],
                tosDate: entry['TOS DATE'],
                tosAmount: entry['TOS AMOUNT'],
                emiFrequency: entry['EMI FREQUENCY'],
                emiAmount: entry['EMI AMOUNT'],
                installmentDueAmount: entry['INSTALLMENT DUE AMOUNT'],
                chargesAmount: entry['CHARGES AMOUNT'],
                agreementDate: entry['AGREEMENT DATE'],
                placeOfConciliation: entry['PLACE OF CONCILATION'],
                conciliatorName: entry['CONSILATOR NAME'],
                conciliationAddress: entry['CONCILATION ADDRESS'],
                campDate: entry['CAMP DATE'],
                advocateName: entry['ADVOCATE NAME'],
                fpr: entry['FPR'],
                documentLink: entry.documentLink
            }));
        };
        
        static async UploadClientsOnMongo(data,batchId){
           const mappedJsonData=this.formatLoanClientData(data,batchId);

          
           const insertManyLegalClients=await loanClient.insertMany(mappedJsonData);
           return insertManyLegalClients;
        }

        static async insertBatchUploadDetails(pdfOriginalName, pdfUrl, excelOriginalName, excelUrl, pagesPerSplit) {
            const batchUploadDetails = new Batch({
                pdfOriginalName: pdfOriginalName, // Store original name
                pdfUrl: pdfUrl, // Store Cloudinary URL
                excelOriginalName: excelOriginalName, // Store Excel original name
                excelUrl: excelUrl, // Store Cloudinary URL
                pagesPerSplit: pagesPerSplit, // Store pagesPerSplit
                createdBy:null
            });

            console.log("we have completed uploading batch details in mongo")
       
            await batchUploadDetails.save();
            return batchUploadDetails;
    }
}
module.exports = MongooseService;
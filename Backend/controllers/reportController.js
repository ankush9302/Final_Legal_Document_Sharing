const WhatsappMessage = require("../models/WhatsappMessage");
const EmailMessage = require("../models/EmailMessage");
const SmsMessage = require("../models/smsMessage");

const mongoose = require("mongoose");
const LoanClient = require("../models/loanClients");

exports.getReport = async (req, res) => {
  const { batchId } = req.params; // Use req.query for GET requests
 console.log("req param",req.params)
  if (!batchId) {
    return res.status(400).json({ error: "batchId is required" });
  }

  try {
    const reportData = await LoanClient.aggregate([
      { $match: { batchId: new mongoose.Types.ObjectId(batchId) } }, // Convert batchId to ObjectId

      // Lookup WhatsApp Messages
      {
        $lookup: {
          from: "whatsappmessages", // Ensure correct collection name
          localField: "_id",
          foreignField: "clientId",
          as: "whatsappMessages",
        },
      },

      // Lookup Email Messages
      {
        $lookup: {
          from: "emailmessages",
          localField: "_id",
          foreignField: "clientId",
          as: "emailMessages",
        },
      },

      // Lookup SMS Messages
      {
        $lookup: {
          from: "smsmessages",
          localField: "_id",
          foreignField: "clientId",
          as: "smsMessages",
        },
      },

      // Group to avoid multiple rows for the same client
      {
        $project: {
          slNo:1,
          loanAmount:1,
          customerName: 1,
          borrowerPhoneNumber: 1,
          finalLoanId:1,
          borrowerEmailId: 1,
          batchId: 1,
          whatsappStatus: { $ifNull: [{ $arrayElemAt: ["$whatsappMessages.status", 0] }, "Not Sent"] },
          emailStatus: { $ifNull: [{ $arrayElemAt: ["$emailMessages.status", 0] }, "Not Sent"] },
          smsStatus: { $ifNull: [{ $arrayElemAt: ["$smsMessages.status", 0] }, "Not Sent"] },
        },
      },
    ]);

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};



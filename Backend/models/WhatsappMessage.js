const mongoose = require("mongoose");
const { Schema } = mongoose;

const WhatsappMessageSchema = new Schema(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "loanClient" },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch" },
    messageId: { type: String, required: true, unique: true }, // Ensure uniqueness
    message: { type: String, required: true }, 
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"], // Updated valid statuses
      default: "sent",
      required: true,
    },
  },
  { timestamps: true }
);

const WhatsappMessage = mongoose.model("WhatsappMessage", WhatsappMessageSchema);
module.exports = WhatsappMessage;

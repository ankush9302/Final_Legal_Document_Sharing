const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema

const JobSchema = new Schema({

    batchId: { type: Schema.Types.ObjectId, ref: 'Batch' }, // Reference to Batch model

    subject: { type: String, required: true }, // Email subject
    body: { type: String, required: true }, // Email body content

    clientsCompleted: { type: Number, default: 0 }, // Number of clients completed
    clientsTotal: { type: Number, default: 0 }, // Total number of clients
    clientsFailed: { type: Number, default: 0 }, // Number of clients failed

    jobStartTime: { type: Date }, // Time when the job started
    jobEndTime: { type: Date }, // Time when the job ended

    pdfOriginalName: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    excelOriginalName: { type: String, required: true },
    excelUrl: { type: String, required: true },
    

    status: { 
        type: String, 
        enum: ['running', 'completed', 'queued'],
        default: 'queued' ,// Default status is 'Not Sent' as we have not tried sending yet i am assuming this
        required: true 
    },
}, { timestamps: true }); // Enable createdAt & updatedAt timestamps

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;

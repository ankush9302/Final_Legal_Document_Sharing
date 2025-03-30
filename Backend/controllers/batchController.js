const Batch = require("../models/Batches");

exports.getBatches = async (req, res) => { 
    try {
      const batches = await Batch.find()
      res.json(batches);
    } catch (error) {
      console.error('Error fetching batches:', error);
      res.status(500).json({ error: 'Failed to fetch batches' });
    }
  }
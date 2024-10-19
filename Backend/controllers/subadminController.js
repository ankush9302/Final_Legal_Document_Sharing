const User = require('../models/User');

exports.getAllSubadmins = async (req, res) => {
  try {
    const subadmins = await User.find({ role: 'subadmin' });
    res.json(subadmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnverifiedSubadmins = async (req, res) => {
  try {
    const unverifiedSubadmins = await User.find({ role: 'subadmin', verified: false });
    console.log(unverifiedSubadmins);
    res.json(unverifiedSubadmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveSubadmin = async (req, res) => {
  try {
    const subadmin = await User.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!subadmin) {
      return res.status(404).json({ message: 'Subadmin not found' });
    }
    res.json(subadmin);
  } catch (error) {
    console.error('Error approving subadmin:', error);
    res.status(500).json({ message: 'Error approving subadmin', error: error.message });
  }
};

exports.deleteSubadmin = async (req, res) => {
  try {
    const subadmin = await User.findByIdAndDelete(req.params.id);
    if (!subadmin) {
      return res.status(404).json({ message: 'Subadmin not found' });
    }
    res.json({ message: 'Subadmin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubadminCities = async (req, res) => {
  try {
    const subadmin = await User.findByIdAndUpdate(
      req.params.id,
      { permissibleCities: req.body.cities },
      { new: true }
    );
    if (!subadmin) {
      return res.status(404).json({ message: 'Subadmin not found' });
    }
    res.json(subadmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Enquiry = require("../models/Enquiry");


exports.createEnquiry = async (req, res) => {

  try {

    const enquiry = new Enquiry(req.body);

    await enquiry.save();

    res.json({ message: "Enquiry sent successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
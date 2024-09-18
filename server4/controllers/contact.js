const Contact = require("../models/Contact");

exports.addContact = (req, res) => {
  const { name, email, message } = req.body;
  const contact = new Contact({
    name,
    email,
    message,
  });
  contact
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

// exports.getContacts = (req, res) => {
//   Contact.find()
//     .then((contacts) => res.status(200).json(contacts))
//     .catch((err) => res.status(401).json(err));
// };

// get all contacts   
exports.getContacts = (req, res) => {
Contact.find()
  .then((contacts) => res.status(200).json(contacts))
  .catch((err) => res.status(401).json(err));
};
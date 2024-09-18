const express = require("express");
const router = express.Router();
const { addContact, getContacts } = require("../controllers/contact");
router.post("/contact-us", addContact);
router.get("/contact-us", getContacts);
module.exports = router;
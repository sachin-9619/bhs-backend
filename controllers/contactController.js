const { submitContact } = require('../services/contactService'); // path to your service/DAO

exports.submitContactForm = async (req, res) => {
  const contact = req.body;

  // Basic validation
  if (
    !contact.firstName ||
    !contact.lastName ||
    !contact.email ||
    !contact.phone ||
    !contact.subject ||
    !contact.message
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const insertId = await submitContact(contact);
    res.status(201).json({ message: 'Contact message saved', id: insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

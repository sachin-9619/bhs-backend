const pool = require('../db');

const Contact = {
  saveContact: async ({ firstName, lastName, email, phone, subject, message }) => {
    return pool.query(
      'INSERT INTO contacts (first_name, last_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone, subject, message]
    );
  }
};

module.exports = Contact;

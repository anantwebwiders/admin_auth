const db = require('../config/db');

const createUser = (name, email, mobile, gender, password, callback) => {
  const query = 'INSERT INTO users (name, email, mobile, gender, password) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, email, mobile, gender, password], callback);
};

const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], callback);
};


const getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null); // user not found
    return callback(null, results[0]); // found user
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  getUserByEmail
};

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("loans.db");

// Create loans table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS loans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        requested_loan_amount REAL NOT NULL,
        approval_status TEXT DEFAULT 'waiting decision'
    )`);
});

module.exports = db;

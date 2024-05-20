const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package
const db = require("./database"); // Import the database module

const app = express();
const PORT = 3000;

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
  })
);

app.use(bodyParser.json()); // Parse JSON bodies

// Create a loan application
app.post("/loans", (req, res) => {
  const { full_name, requested_loan_amount } = req.body;
  db.run(
    `INSERT INTO loans (full_name, requested_loan_amount) VALUES (?, ?)`,
    [full_name, requested_loan_amount],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Retrieve all loan applications
app.get("/loans", (req, res) => {
  const { user_type, user_id } = req.query;
  let sql = "SELECT * FROM loans";
  if (user_type === "user" && user_id) {
    sql += ` WHERE id = ?`;
  }

  db.all(sql, user_type === "user" ? [user_id] : [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Approve or deny a loan application
app.put("/loans/:id", (req, res) => {
  const { id } = req.params;
  const { approval_status } = req.body;
  db.run(
    `UPDATE loans SET approval_status = ? WHERE id = ? AND approval_status = 'waiting decision'`,
    [approval_status, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res
          .status(404)
          .json({ error: "Loan not found or already processed" });
      }
      res.json({ changes: this.changes });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

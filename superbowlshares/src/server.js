// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./ledgerDB.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shareHolder TEXT,
    teamName TEXT,
    numberOfShares INTEGER,
    weekCostPerShare REAL,
    firstWeekRequirement BOOLEAN,
    week5Requirement BOOLEAN,
    week10Requirement BOOLEAN,
    week15Requirement BOOLEAN
  )`);
});

// Routes
app.get('/ledger', (req, res) => {
  db.all('SELECT * FROM ledger', (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

app.post('/ledger', (req, res) => {
  const {
    shareHolder,
    teamName,
    numberOfShares,
    weekCostPerShare,
    firstWeekRequirement,
    week5Requirement,
    week10Requirement,
    week15Requirement
  } = req.body;

  db.run(
    `INSERT INTO ledger (shareHolder, teamName, numberOfShares, weekCostPerShare, firstWeekRequirement, week5Requirement, week10Requirement, week15Requirement) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      shareHolder,
      teamName,
      numberOfShares,
      weekCostPerShare,
      firstWeekRequirement,
      week5Requirement,
      week10Requirement,
      week15Requirement
    ],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ id: this.lastID, ...req.body });
      }
    }
  );
});

app.delete('/ledger/:id', (req, res) => {
  db.run('DELETE FROM ledger WHERE id = ?', req.params.id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
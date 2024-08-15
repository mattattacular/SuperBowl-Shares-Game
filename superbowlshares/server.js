// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const https = require('https');

const app = express();
const port = 3001;

// CORS configuration
/* const corsOptions = {
  origin: ['https://major-bird-wired.ngrok-free.app','https://a8da-108-14-163-166.ngrok-free.app/api/ledger','https://a8da-108-14-163-166.ngrok-free.app'], // Add your ngrok URLs here
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}; */

// SSL Certificate
const privateKey = fs.readFileSync('react-key.pem', 'utf8');
const certificate = fs.readFileSync('react-cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware
app.use(cors({
  origin: ['https://localhost:3000', 'https://major-bird-wired.ngrok-free.app']
}));
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// Serve static files from the React app
//app.use(express.static(path.join(__dirname, 'build')));

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

// API routes
app.get('/api/ledger', (req, res) => {
  db.all('SELECT * FROM ledger', (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/ledger', (req, res) => {
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

app.delete('/api/ledger/:id', (req, res) => {
  db.run('DELETE FROM ledger WHERE id = ?', req.params.id, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.sendStatus(204);
    }
  });
});

const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(port, '0.0.0.0', () => {
	console.log(`Server is running on https://0.0.0.0:${port}`);
});
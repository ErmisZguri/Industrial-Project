require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');


const app = express();


app.use(cors());
app.use(express.json());


const PORT = 3001;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    encrypt: true, // Use encryption for Azure SQL, set to false if using locally without encryption // Question here - Are we using encyryption?
    trustServerCertificate: true // Set to true if you are using a self-signed certificate locally  //
  }
};


sql.connect(dbConfig, (err) => {
  if (err) {
    console.error('No connection', err);
    return;
  }
  console.log('Connected');
});


app.get('/api/test', (req, res) => {
  res.send('Beckend');
});

app.get('/api/test', async (req, res) => {
  try {
    // Run a test query
    const result = await sql.query`SELECT 1 + 1 AS solution`;
    // Send the query result as a JSON response
    res.json({ message: 'Database connected!', solution: result.recordset[0].solution });
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).send('Database query failed');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



// Questions for the proffesor:
// Are we using the database locally or with an IP adress?
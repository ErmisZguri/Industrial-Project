require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const path = require('path'); 



const app = express(); // created (instance) of Express
const port = 3000; // port for the server to listen at

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));


const config = {
  user: process.env.DB_USER,            // 'myuser'
  password: process.env.DB_PASSWORD,    // 'admminadmin04'
  server: process.env.DB_SERVER,        // 'localhost'
  database: process.env.DB_DATABASE,    // 'IndustrialProjectsDatabase'
  port: parseInt(process.env.DB_PORT),  // 1433
  options: {
    encrypt: true,                   // Use this if you're connecting to Azure SQL Database
    trustServerCertificate: true     // Use this if you're connecting to a local SQL Server instance
  }
};

async function connectToDatabase() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to SQL Server successfully!");
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}





connectToDatabase();

// Example query function
async function getProjects() {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query("SELECT * FROM Projects");
    console.log(result.recordset);
  } catch (err) {
    console.error("Error executing query:", err);
  }
}

getProjects();


// endpoint to get all of the projects
app.get('/projects', async (req, res) => {
  try {
    const pool = await connectToDatabase();  // Connect to the database
    const result = await pool.request().query('SELECT * FROM Projects'); // Run a query to get all projects
    res.json(result.recordset); // Send the data back as JSON (a format React can understand)
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Server Error'); // Send an error message if something goes wrong
  }
});


// Endpoint to get all students
app.get('/students', async (req, res) => {
  try {
    const pool = await connectToDatabase();  // Connect to the database
    const result = await pool.request().query('SELECT * FROM Students'); // Run a query to get all students
    res.json(result.recordset); // Send the data back as JSON
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Server Error'); // Send an error message if something goes wrong
  }
});

// Endpoint to get all companies
app.get('/companies', async (req, res) => {
  try {
    const pool = await connectToDatabase();  // Connect to the database
    const result = await pool.request().query('SELECT * FROM Companies'); // Run a query to get all companies
    res.json(result.recordset); // Send the data back as JSON
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Server Error'); // Send an error message if something goes wrong
  }
});





// Endpoint to get projects by year
app.get('/projects/year/:year', async (req, res) => {
  try {
    const { year } = req.params; // get the year from the URL
    const pool = await connectToDatabase(); // connect to database
    const result = await pool.request()
      .input('projectYear', sql.Int, year) // 
      .query('SELECT * FROM Projects WHERE year = @projectYear'); // query to filter projects by year

    if (result.recordset.length > 0) {
      res.json(result.recordset); // Return the projects 
    } else {
      res.status(404).send('No projects found for the specified year'); // Return 404 if no projects
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Server Error'); // send an error message if something is wrong
  }
});



// Endpoint to get a specific project by ID
app.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params; // retrieve project ID from the URL 
    const pool = await connectToDatabase(); // connect to database
    const result = await pool.request()
      .input('projectId', sql.Int, id) // Project ID specified as a parameter
      .query('SELECT * FROM Projects WHERE project_id = @projectId'); // Run the query 

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send('Project not found'); // Return 404 if project doesnt exist
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Server Error'); // Send an error message if something goes wrong
  }
});


// Endpoint to add a new project
app.post('/projects', async (req, res) => {
  try {
    const { project_name, description, team_members, logo, year, company_id } = req.body; // Retrieve data from the request body
    const pool = await connectToDatabase(); // Connect to the database
    await pool.request()
      .input('projectName', sql.NVarChar, project_name)
      .input('description', sql.NVarChar, description)
      .input('teamMembers', sql.NVarChar, team_members)
      .input('logo', sql.NVarChar, logo)
      .input('year', sql.Int, year)
      .input('companyId', sql.Int, company_id)
      .query(`INSERT INTO Projects (project_name, description, team_members, logo, year, company_id)
              VALUES (@projectName, @description, @teamMembers, @logo, @year, @companyId)`);
    
    res.status(201).send('Project created successfully'); // Send success response
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Server Error'); // Send an error message if something goes wrong
  }
});



// Endpoint to delete a project by ID
app.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params; // Retrieve project ID from URL
    const pool = await connectToDatabase(); // Connect to the database
    const result = await pool.request()
      .input('projectId', sql.Int, id)
      .query('DELETE FROM Projects WHERE project_id = @projectId');

    if (result.rowsAffected[0] > 0) {
      res.send('Project deleted successfully'); // Send success response if a row was deleted
    } else {
      res.status(404).send('Project not found'); // Send error if no row was deleted
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Server Error'); // Send an error message if something goes wrong
  }
});





// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



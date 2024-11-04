/*********************************************************************************
 WEB322 – Assignment 02
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Aditya Mahesh Tambe Student ID: 171969223 Date: 26-09-2024
 *********************************************************************************/

 const express = require("express");
 const path = require("path");
 const projectData = require("./modules/projects");
 
 const app = express();
 const PORT = process.env.port || 8080;
 // Serve static files from the 'public' folder
 app.use(express.static('public'));

 projectData.initialize()
    .then(() => {
        // Start the server after initialization is complete
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Server is running on  http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize data:", err);
  });

 // Routes for home page
 app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname,'/views/home.html'));
 });
 
 // Routes for about page
 app.get("/about", (req, res) => {
   res.sendFile(path.join(__dirname, "views", "about.html"));
 });
 
 // Routing the projects with sector filter
 app.get("/solutions/projects", (req, res) => {
   const sector = req.query.sector;
   if (sector) {
     projectData.getProjectsBySector(sector)
       .then(projects => res.json(projects))
       .catch(err => res.status(404).send(err.message));
   } else {
     projectData.getAllProjects()
       .then(projects => res.json(projects))
       .catch(err => res.status(404).send(err.message));
   }
 });
 
 // Route for getting a project by ID
 app.get("/solutions/projects/:id", (req, res) => {
   const projectId = parseInt(req.params.id, 10); // Parse the ID from the URL
   projectData.getProjectById(projectId)
     .then(project => res.json(project))
     .catch(err => res.status(404).send(err.message));
 });
 
 // Custom 404 Error handling
 app.use((req, res) => {
   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
 });
 
 // Demo routes
 app.get("/solutions/projects/id-demo", (req, res) => {
   projectData.getProjectById(8)
     .then(project => res.json(project))
     .catch(err => res.status(404).send(err));
 });
 
 app.get("/solutions/projects/sector-demo", (req, res) => {
   projectData.getProjectsBySector("energy")
     .then(projects => res.json(projects))
     .catch(err => res.status(404).send(err));
 });
 
 // Initialize project data and export the app for serverless deployment
 module.exports = async (req, res) => {
   try {
     await projectData.initialize(); // Ensure data is initialized
     app(req, res); // Pass the request to the Express app
   } catch (err) {
     res.status(500).send("Failed to initialize project data");
   }
 };
 
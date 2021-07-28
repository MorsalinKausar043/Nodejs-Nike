require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
require('./db/db');
const port = process.env.PORT || 8001;
const router = require("./router");
const hbs = require("hbs");

// middleware link 
const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");


// middleware 
app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use("/jq", express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use(router);
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);




// app listining 

app.listen(port, () => console.log(`express port is ${port}!`));
const express = require("express");
const {router} = require("./routes/index.js");
const expressEjsLayouts = require("express-ejs-layouts");
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();
port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 8080; 

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set EJS
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.set('views', './views');
app.use(express.static('./public'));

// use router
app.use('/', router);
// define 404
app.use((req, res, next) => {
    res.redirect('/');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
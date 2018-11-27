const express = require('express');
const mongoose = require('mongoose'); // To interact with mongodb
const bodyParser = require('body-parser'); // take requests and get data from body
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const db = require('./config/keys').mongoURI;

// to access the api and the requests
const app = express();
app.use(cors());

// Bodyparser Middleware for json requests
app.use(bodyParser.json());

// Parser for Postman
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

var User = require ('./models/user');
const routes = require('./routes');
app.use(routes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
// connect to mongoDB via mongoose 
mongoose
    .connect(db)
    .then (() => console.log('DB connected...'))
    .catch(err => console.log(err));


mongoose.set('debug', true);

// any url with /api/items will get the file 'items'
//app.use('/api', api);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log (`Server started on ${port}`));

module.exports = app;